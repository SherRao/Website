import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Sends signed-out visitors from /admin to sign-in. A convenience only: every admin page, action and upload checks
 * the owner session itself. Runs only on /admin, so the public page is untouched.
 */
export const proxy = auth((req) => {
    if (req.auth) return;
    const signIn = new URL("/api/auth/signin", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(signIn);
});

export const config = { matcher: ["/admin", "/admin/:path*"] };
