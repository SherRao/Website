import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Sends signed-out visitors from /admin to sign-in. A convenience only: every admin page, action and upload checks
 * the owner session itself. Runs only on /admin, so the public page is untouched.
 *
 * Reads the session with a bare auth() rather than the auth(handler) wrapper: the wrapper re-sets the session cookie
 * on every response, so a prefetch that was in flight during sign-out would sign the browser back in.
 */
export const proxy = async (req: NextRequest) => {
    if (await auth()) return;
    const signIn = new URL("/api/auth/signin", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(signIn);
};

export const config = { matcher: ["/admin", "/admin/:path*"] };
