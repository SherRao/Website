import { getProfile } from "@/content";

/**
 * Sends the visitor to the current resume PDF. A temporary (307) redirect, because the target changes with every
 * upload and browsers cache a permanent one forever.
 */
export const redirectToResume = async () => {
    const { resume } = await getProfile();
    return new Response(null, { status: 307, headers: { Location: resume.url } });
};
