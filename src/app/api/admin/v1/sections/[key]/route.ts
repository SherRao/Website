import { loadSectionForEditing } from "@/content";
import { answerChange, json, parseJson, refuse, signedSection } from "@/lib/admin-api";
import type { SectionRead, SectionSave } from "@/lib/admin-contract";
import { saveSectionCore } from "@/lib/content-admin";

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

const isSave = (body: unknown): body is SectionSave =>
    typeof body === "object" &&
    body !== null &&
    "data" in body &&
    "version" in body &&
    (typeof body.version === "string" || body.version === null);

/**
 * PUT /api/admin/v1/sections/:key with `{ data, version }`: saves the whole section if it passes the schema (and the
 * resume check) and is based on the current version. 200 with the new version, 409 if stale, 422 with field errors if
 * invalid, 503 where saving is off. A success is live on the next page load.
 */
export const PUT = signedSection<{ key: string }>(async ({ key, body }) => {
    const save = parseJson(body);
    if (!isSave(save)) return refuse(422, "Send the section as { data, version }. Nothing was saved.");
    return answerChange(key, await saveSectionCore(key, save.data, save.version));
});
