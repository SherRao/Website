import { describe, expect, it } from "vitest";
import {
    CONTRACT_VERSION,
    parseSecrets,
    sign,
    SIGNATURE_HEADER,
    SIGNATURE_WINDOW,
    signingString,
    TIMESTAMP_HEADER,
    verify,
} from "@/lib/admin-contract";

const SECRET = "known-answer-secret";
const NOW = 1_767_225_600; // 2026-01-01T00:00:00Z
const BASE = "https://sherrao.tech/api/admin/v1";

/** Signs a request, then checks it as the site would, with whatever the test changes on the way. */
const roundTrip = ({
    method = "PUT",
    url = `${BASE}/sections/profile`,
    body = '{"data":{},"version":"1"}',
    signedWith = SECRET,
    secrets = [SECRET],
    signedAt = NOW,
    checkedAt = NOW,
    received = {},
}: {
    method?: string;
    url?: string;
    body?: string;
    signedWith?: string;
    secrets?: string[];
    signedAt?: number;
    checkedAt?: number;
    received?: { method?: string; url?: string; body?: string };
} = {}) => {
    const headers = sign({ secret: signedWith, method, url, body, now: signedAt });
    return verify({
        secrets,
        method: received.method ?? method,
        url: received.url ?? url,
        body: received.body ?? body,
        timestamp: headers[TIMESTAMP_HEADER],
        signature: headers[SIGNATURE_HEADER],
        now: checkedAt,
    });
};

describe("the admin contract", () => {
    it("is version 1", () => {
        expect(CONTRACT_VERSION).toBe(1);
    });

    describe("signatures", () => {
        // A fixed vector, computed independently (with openssl). The admin app's copy of the contract checks the
        // same one, so the two can't drift apart unnoticed.
        it("match the known-answer vector", () => {
            const body = '{"data":{"headline":"hi"},"version":"3"}';
            expect(
                signingString({ method: "put", target: "/api/admin/v1/sections/profile?dry=1", timestamp: NOW, body }),
            ).toBe(
                "PUT\n/api/admin/v1/sections/profile?dry=1\n1767225600\n" +
                    "f95fd528276715b216e8df8cc9b6d818ffe51b2d457845924935ae222f2014e4",
            );
            expect(
                sign({ secret: SECRET, method: "PUT", url: `${BASE}/sections/profile?dry=1`, body, now: NOW }),
            ).toEqual({
                [TIMESTAMP_HEADER]: "1767225600",
                [SIGNATURE_HEADER]: "fb57b2040334a2c0cc45ef90cd290ded44bcdf4329c7a09fbe70ea7ac695a62d",
            });
            expect(sign({ secret: SECRET, method: "GET", url: `${BASE}/manifest`, now: NOW })).toEqual({
                [TIMESTAMP_HEADER]: "1767225600",
                [SIGNATURE_HEADER]: "ef2a800a928f52853a3826deaa83eafe75ea6da02ff5ab55f8cf7e0718a4e512",
            });
        });

        it("accept a request exactly as signed", () => {
            expect(roundTrip()).toBe(true);
            expect(roundTrip({ method: "GET", url: `${BASE}/manifest`, body: "" })).toBe(true);
        });

        it("sign binary bodies, like a multipart upload", () => {
            const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x00, 0xff]);
            const headers = sign({ secret: SECRET, method: "POST", url: `${BASE}/uploads`, body: bytes, now: NOW });
            const check = (body: Uint8Array) =>
                verify({
                    secrets: [SECRET],
                    method: "POST",
                    url: `${BASE}/uploads`,
                    body,
                    timestamp: headers[TIMESTAMP_HEADER],
                    signature: headers[SIGNATURE_HEADER],
                    now: NOW,
                });
            expect(check(bytes)).toBe(true);
            expect(check(new Uint8Array([...bytes.slice(0, -1), 0xfe]))).toBe(false);
        });

        it("reject a body changed after signing", () => {
            expect(roundTrip({ received: { body: '{"data":{"evil":true},"version":"1"}' } })).toBe(false);
        });

        it("reject a different path", () => {
            expect(roundTrip({ received: { url: `${BASE}/sections/events` } })).toBe(false);
        });

        it("reject a different query", () => {
            const url = `${BASE}/sections/profile/revisions?limit=20&offset=0`;
            expect(roundTrip({ method: "GET", url, body: "" })).toBe(true);
            expect(roundTrip({ method: "GET", url, body: "", received: { url: `${url}0` } })).toBe(false);
            expect(
                roundTrip({ method: "GET", url, body: "", received: { url: `${BASE}/sections/profile/revisions` } }),
            ).toBe(false);
        });

        it("reject a different method", () => {
            expect(roundTrip({ received: { method: "POST" } })).toBe(false);
        });

        it("accept a timestamp up to five minutes off, and reject an expired or future-dated one", () => {
            expect(roundTrip({ checkedAt: NOW + SIGNATURE_WINDOW })).toBe(true);
            expect(roundTrip({ checkedAt: NOW - SIGNATURE_WINDOW })).toBe(true);
            expect(roundTrip({ checkedAt: NOW + SIGNATURE_WINDOW + 1 })).toBe(false);
            expect(roundTrip({ checkedAt: NOW - SIGNATURE_WINDOW - 1 })).toBe(false);
        });

        it("accept either secret while one is being rotated, and no other", () => {
            const secrets = parseSecrets(" old-secret , new-secret ,");
            expect(secrets).toEqual(["old-secret", "new-secret"]);
            expect(roundTrip({ secrets, signedWith: "old-secret" })).toBe(true);
            expect(roundTrip({ secrets, signedWith: "new-secret" })).toBe(true);
            expect(roundTrip({ secrets, signedWith: SECRET })).toBe(false);
            expect(roundTrip({ secrets: ["new-secret"], signedWith: "old-secret" })).toBe(false);
        });

        it("reject everything when no secret is configured", () => {
            expect(parseSecrets(undefined)).toEqual([]);
            expect(parseSecrets(" , ")).toEqual([]);
            expect(roundTrip({ secrets: [] })).toBe(false);
        });

        it("reject missing or malformed headers", () => {
            const { [TIMESTAMP_HEADER]: timestamp, [SIGNATURE_HEADER]: signature } = sign({
                secret: SECRET,
                method: "GET",
                url: `${BASE}/manifest`,
                now: NOW,
            });
            const check = (t: string | null, s: string | null) =>
                verify({
                    secrets: [SECRET],
                    method: "GET",
                    url: `${BASE}/manifest`,
                    timestamp: t,
                    signature: s,
                    now: NOW,
                });
            expect(check(timestamp, signature)).toBe(true);
            expect(check(null, signature)).toBe(false);
            expect(check(timestamp, null)).toBe(false);
            expect(check(`0${timestamp}`, signature)).toBe(false);
            expect(check(`${timestamp}.0`, signature)).toBe(false);
            expect(check(timestamp, signature.toUpperCase())).toBe(false);
            expect(check(timestamp, signature.slice(2))).toBe(false);
        });
    });
});
