import { describe, expect, it } from "vitest";
import { afterMove, afterRemove, remapListErrors } from "@/app/admin/_editor/errors";

const errors = (...paths: string[]) => paths.map((path) => ({ path, message: `bad ${path}` }));
const paths = (list: { path: string }[]) => list.map((e) => e.path);

describe("remapping field errors with their list items", () => {
    it("moves an item's errors with it, and the errors of the items it passed", () => {
        const before = errors("jobs.0.org", "jobs.2.stints.0.end", "jobs.3.org", "name");
        // jobs.2 moves up to 0, so 0 and 1 shift down one.
        expect(paths(remapListErrors(before, "jobs", afterMove(2, 0)))).toEqual([
            "jobs.1.org",
            "jobs.0.stints.0.end",
            "jobs.3.org",
            "name",
        ]);
        expect(paths(remapListErrors(errors("jobs.0.org", "jobs.1.org"), "jobs", afterMove(0, 1)))).toEqual([
            "jobs.1.org",
            "jobs.0.org",
        ]);
    });

    it("drops a removed item's errors and moves later items' errors up", () => {
        const before = errors("jobs.0.org", "jobs.1.org", "jobs.2.line", "jobs");
        expect(paths(remapListErrors(before, "jobs", afterRemove(1)))).toEqual(["jobs.0.org", "jobs.1.line", "jobs"]);
    });

    it("keeps the message, and only touches the list it was given", () => {
        const before = errors("jobs.2.stints.1.end", "jobsArchive.1.org");
        const after = remapListErrors(before, "jobs.2.stints", afterRemove(0));
        expect(after).toEqual([
            { path: "jobs.2.stints.0.end", message: "bad jobs.2.stints.1.end" },
            { path: "jobsArchive.1.org", message: "bad jobsArchive.1.org" },
        ]);
    });

    it("works for a section that is itself a list", () => {
        expect(paths(remapListErrors(errors("0.name", "2.what", ""), "", afterRemove(0)))).toEqual(["1.what", ""]);
    });
});
