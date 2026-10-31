import { redirect } from "next/navigation";
import { NotOwnerError } from "@/lib/owner";
import { requireOwner } from "@/lib/require-owner";

/** For admin pages: the owner's session, or a redirect to sign-in. Reads the request, so call it inside <Suspense>. */
export const ownerOrSignIn = async (callbackUrl: string) => {
    try {
        return await requireOwner();
    } catch (error) {
        if (error instanceof NotOwnerError) redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        throw error;
    }
};
