import { connection } from "next/server";
import { auth } from "@/auth";
import { assertOwner } from "./owner";

/**
 * Every admin action, upload and page calls this itself, so access never depends on the proxy alone. Reads the
 * request's session, so it must run at request time (behind a Suspense boundary on a page).
 */
export const requireOwner = async () => {
    // Auth.js makes a random CSRF token while reading the session; this marks the work as request-time.
    await connection();
    return assertOwner(await auth());
};
