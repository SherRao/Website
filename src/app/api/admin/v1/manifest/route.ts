import { FALLBACK_NAME, getProfile } from "@/content";
import { editorLayout, FLAGS, UPLOAD_KINDS } from "@/content/editor-layout";
import { canSaveContent, READ_ONLY_MESSAGE } from "@/content/repository";
import { sectionKeys } from "@/content/schema";
import { json, signed } from "@/lib/admin-api";
import { CONTRACT_VERSION, type Manifest } from "@/lib/admin-contract";
import { uploadMode } from "@/lib/local-uploads";

/** The site's name and public origin, from the profile. If the profile can't be read, the panel still opens. */
const project = async (request: Request): Promise<Manifest["project"]> => {
    try {
        const { site } = await getProfile();
        return { name: site.title, origin: new URL(site.url).origin };
    } catch {
        return { name: FALLBACK_NAME, origin: new URL(request.url).origin };
    }
};

/**
 * GET /api/admin/v1/manifest: everything the admin app needs to edit this site. The layout is built per request, so
 * its date-dependent defaults are current, and `saving` and `uploadMode` come from this deployment's environment.
 */
export const GET = signed(async ({ request }) => {
    const layout = editorLayout();
    return json({
        contract: CONTRACT_VERSION,
        project: await project(request),
        sections: sectionKeys.map((key) => ({ key, ...layout[key] })),
        uploads: UPLOAD_KINDS,
        flags: FLAGS,
        saving: canSaveContent() ? { enabled: true } : { enabled: false, reason: READ_ONLY_MESSAGE },
        uploadMode: uploadMode(),
    } satisfies Manifest);
});
