import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
vi.mock("@/auth", () => ({ auth: () => auth() }));

const { requireOwner } = await import("@/lib/require-owner");
const { isOwnerGithubId, NotOwnerError } = await import("@/lib/owner");

describe("requireOwner", () => {
    beforeEach(() => vi.stubEnv("ADMIN_GITHUB_ID", "4242"));
    afterEach(() => {
        vi.unstubAllEnvs();
        auth.mockReset();
    });

    it("rejects a request with no session", async () => {
        auth.mockResolvedValue(null);
        await expect(requireOwner()).rejects.toBeInstanceOf(NotOwnerError);
    });

    it("rejects a session for another GitHub account", async () => {
        auth.mockResolvedValue({ user: { name: "someone", githubId: "999" } });
        await expect(requireOwner()).rejects.toBeInstanceOf(NotOwnerError);
    });

    it("rejects a session with no GitHub id", async () => {
        auth.mockResolvedValue({ user: { name: "someone" } });
        await expect(requireOwner()).rejects.toBeInstanceOf(NotOwnerError);
    });

    it("accepts the owner's session", async () => {
        const session = { user: { name: "owner", githubId: "4242" } };
        auth.mockResolvedValue(session);
        await expect(requireOwner()).resolves.toBe(session);
    });

    it("lets nobody in when ADMIN_GITHUB_ID is unset", async () => {
        vi.stubEnv("ADMIN_GITHUB_ID", "");
        auth.mockResolvedValue({ user: { githubId: "4242" } });
        await expect(requireOwner()).rejects.toBeInstanceOf(NotOwnerError);
        expect(isOwnerGithubId(undefined)).toBe(false);
    });

    it("the sign-in check matches numeric ids from GitHub's profile", () => {
        expect(isOwnerGithubId(4242)).toBe(true);
        expect(isOwnerGithubId(42)).toBe(false);
    });
});
