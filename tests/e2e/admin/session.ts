import { expect, type BrowserContext, type Page } from "@playwright/test";
import { encode } from "next-auth/jwt";

/** Auth settings for the test servers. Not real credentials: GitHub is never contacted. */
export const TEST_AUTH_ENV = {
    AUTH_SECRET: "playwright-only-secret-not-used-anywhere-else",
    AUTH_TRUST_HOST: "true",
    AUTH_GITHUB_ID: "playwright",
    AUTH_GITHUB_SECRET: "playwright",
    ADMIN_GITHUB_ID: "4242",
};

const COOKIE = "authjs.session-token";

/** Signs the browser in as a GitHub account by setting the session cookie Auth.js would set after sign-in. */
export const signInAs = async (context: BrowserContext, baseURL: string, githubId = TEST_AUTH_ENV.ADMIN_GITHUB_ID) => {
    const value = await encode({
        token: { name: "test owner", sub: githubId, githubId },
        secret: TEST_AUTH_ENV.AUTH_SECRET,
        salt: COOKIE,
    });
    await context.addCookies([{ name: COOKIE, value, url: baseURL, httpOnly: true, sameSite: "Lax" }]);
};

/** Opens an admin editor and waits until it's interactive. */
export const openEditor = async (page: Page, path: string) => {
    await page.goto(path);
    await expect(page.locator("form.editor[data-hydrated]")).toBeVisible();
};
