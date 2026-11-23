import { vi } from "vitest";
import type { ContentRepository } from "@/content/repository";
import { sign, SIGNATURE_WINDOW, type Body } from "@/lib/admin-contract";

/** The secret the API tests configure, and an origin for their requests. */
export const TEST_SECRET = "unit-test-secret";
export const ORIGIN = "http://localhost:3000";

/** Any route handler: its params are whatever the test passes. */
type Handler = (request: Request, context: { params: Promise<never> }) => Promise<Response>;

type Call = {
    method?: string;
    body?: Body;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    /** How the request is signed: with the test secret now (the default), another secret, at another time, or not. */
    signature?: "valid" | "none" | "expired" | "future" | { secret: string };
};

/** Calls a route handler the way the admin app's server would, signed unless the test says otherwise. */
export const call = async (handler: Handler, path: string, { signature = "valid", ...opts }: Call = {}) => {
    const method = opts.method ?? "GET";
    const url = `${ORIGIN}/api/admin/v1${path}`;
    const now = Math.floor(Date.now() / 1000);
    const at = { expired: now - SIGNATURE_WINDOW - 1, future: now + SIGNATURE_WINDOW + 1 }[signature as string] ?? now;
    const secret = typeof signature === "object" ? signature.secret : TEST_SECRET;
    const signed = signature === "none" ? {} : sign({ secret, method, url, body: opts.body, now: at });
    const request = new Request(url, {
        method,
        body: opts.body === undefined ? undefined : (opts.body as BodyInit),
        headers: { ...signed, ...opts.headers },
    });
    return handler(request, { params: Promise.resolve(opts.params ?? {}) as Promise<never> });
};

/** A JSON body for `call`. */
export const jsonBody = (value: unknown) => ({
    body: JSON.stringify(value),
    headers: { "Content-Type": "application/json" },
});

/** Wraps every method of a repository in a spy, to check whether a request touched the store at all. */
export const spyOn = (repo: ContentRepository): ContentRepository & Record<string, ReturnType<typeof vi.fn>> =>
    Object.fromEntries(
        Object.entries(repo).map(([name, method]) => [name, vi.fn(method as (...args: unknown[]) => unknown)]),
    ) as ContentRepository & Record<string, ReturnType<typeof vi.fn>>;

export const untouched = (repo: Record<string, ReturnType<typeof vi.fn>>) =>
    Object.values(repo).every((method) => method.mock.calls.length === 0);
