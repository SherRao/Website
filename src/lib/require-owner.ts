import { auth } from "@/auth";
import { assertOwner } from "./owner";

/**
 * Every admin action, upload and page calls this itself, so access never depends on the proxy alone. Reads the
 * request's session, so it must run at request time (behind a Suspense boundary on a page).
 */
export const requireOwner = async () => assertOwner(await auth());
