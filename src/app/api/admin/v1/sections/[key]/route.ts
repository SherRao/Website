import { loadSectionForEditing } from "@/content";
import { json, signedSection } from "@/lib/admin-api";
import type { SectionRead } from "@/lib/admin-contract";

/**
 * GET /api/admin/v1/sections/:key: the latest stored section, read from the store rather than the site's cache, with
 * its version. Data that fails the schema is still returned, with its problems, so it can be fixed.
 */
export const GET = signedSection<{ key: string }>(async ({ key }) => {
    const section = await loadSectionForEditing(key);
    return json(
        (section.missing
            ? { data: null, issues: [], missing: true, version: null }
            : {
                  data: section.data,
                  issues: section.issues,
                  missing: false,
                  version: section.version,
              }) satisfies SectionRead,
    );
});
