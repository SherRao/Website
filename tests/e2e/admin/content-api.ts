import type { APIRequestContext } from "@playwright/test";
import { sign } from "../../../src/lib/admin-contract";

/** The content API secret for the test servers. Not a real one: it's only ever used here. */
export const TEST_API_ENV = { ADMIN_API_SECRETS: "playwright-only-api-secret" };

/** Calls the content API as the admin app's server would: signed, with a JSON body if there is one. */
export const callApi = async (
    request: APIRequestContext,
    baseURL: string,
    method: "GET" | "PUT" | "POST",
    path: string,
    { body, secret = TEST_API_ENV.ADMIN_API_SECRETS }: { body?: unknown; secret?: string | null } = {},
) => {
    const url = new URL(`/api/admin/v1${path}`, baseURL).href;
    const raw = body === undefined ? undefined : JSON.stringify(body);
    const headers = {
        ...(secret === null ? {} : sign({ secret, method, url, body: raw })),
        ...(raw === undefined ? {} : { "Content-Type": "application/json" }),
    };
    return request.fetch(url, { method, headers, data: raw });
};
