import { describe as group, expect, it } from "vitest";
import type { Field } from "@/app/admin/_editor/fields";
import { clean, describe, fieldId, getIn, join, setIn } from "@/app/admin/_editor/form-state";

group("paths", () => {
    it("reads through objects and lists, and gives undefined for a missing path", () => {
        const value = { jobs: [{ org: "a" }] };
        expect(getIn(value, ["jobs", 0, "org"])).toBe("a");
        expect(getIn(value, ["nope", 0, "org"])).toBeUndefined();
    });

    it("writes without changing the original", () => {
        const value = { jobs: [{ org: "a" }, { org: "b" }] };
        const next = setIn(value, ["jobs", 1, "org"], "c") as typeof value;
        expect(next.jobs[1].org).toBe("c");
        expect(value.jobs[1].org).toBe("b");
        expect(next.jobs[0]).toBe(value.jobs[0]);
    });

    it("skips a root list's empty key", () => {
        expect(join(["a"], "")).toEqual(["a"]);
        expect(join(["a"], 0)).toEqual(["a", 0]);
    });

    it("makes ids from paths", () => {
        expect(fieldId(["jobs", 0, "org"])).toBe("f-jobs-0-org");
        expect(fieldId([])).toBe("f-root");
    });
});

group("clean", () => {
    it("drops blank optional text and unticked optional checkboxes, and keeps required ones", () => {
        const fields: Field[] = [
            { kind: "text", key: "a", label: "A", optional: true },
            { kind: "text", key: "b", label: "B" },
            { kind: "number", key: "c", label: "C", optional: true },
            { kind: "checkbox", key: "d", label: "D", optional: true },
            { kind: "checkbox", key: "e", label: "E" },
        ];
        expect(clean(fields, { a: "", b: "", c: "", d: false, e: false })).toEqual({ b: "", e: false });
    });

    it("makes a blank id from the field it follows, and keeps a typed one", () => {
        const fields: Field[] = [
            { kind: "text", key: "name", label: "Name" },
            { kind: "slug", key: "id", label: "Id", from: "name" },
        ];
        expect(clean(fields, { name: "Montréal Fest", id: "" })).toEqual({
            name: "Montréal Fest",
            id: "montreal-fest",
        });
        expect(clean(fields, { name: "x", id: "kept" })).toEqual({ name: "x", id: "kept" });
    });

    it("cleans a root list's items", () => {
        const fields: Field[] = [
            {
                kind: "list",
                key: "",
                label: "L",
                item: "i",
                summary: "a",
                fields: [{ kind: "text", key: "a", label: "A", optional: true }],
                empty: () => ({}),
            },
        ];
        expect(clean(fields, [{ a: "" }, { a: "x" }])).toEqual([{}, { a: "x" }]);
    });

    it("saves only the chosen variant's fields", () => {
        const fields: Field[] = [
            {
                kind: "variant",
                key: "art",
                label: "Art",
                optional: { label: "None" },
                options: [
                    { value: "a", label: "A", fields: [{ kind: "text", key: "x", label: "X" }], empty: () => ({}) },
                    { value: "b", label: "B", fields: [{ kind: "text", key: "y", label: "Y" }], empty: () => ({}) },
                ],
            },
        ];
        expect(clean(fields, { art: { kind: "a", x: "1", y: "left over" } })).toEqual({ art: { kind: "a", x: "1" } });
        expect(clean(fields, { art: undefined })).toEqual({});
    });

    it("saves a needed placeholder's hint, or a filled one's details", () => {
        const fields: Field[] = [
            {
                kind: "placeholder",
                key: "p",
                label: "P",
                extra: [{ kind: "strings", key: "tags", label: "T", item: "t" }],
            },
        ];
        expect(clean(fields, { p: { needed: true, hint: "h", details: "left over", tags: ["t"] } })).toEqual({
            p: { needed: true, hint: "h", tags: ["t"] },
        });
        expect(clean(fields, { p: { needed: false, hint: "", details: "d", url: "", tags: [] } })).toEqual({
            p: { needed: false, details: "d", tags: [] },
        });
    });
});

group("describe", () => {
    const fields: Field[] = [
        {
            kind: "list",
            key: "events",
            label: "Events",
            item: "event",
            summary: "name",
            fields: [{ kind: "text", key: "name", label: "Name" }],
            empty: () => ({}),
        },
    ];

    it("names a list item by its summary field", () => {
        expect(describe(fields, { events: [{ name: "spurhacks" }] }, ["events", "0", "name"])).toBe(
            "Events › spurhacks › Name",
        );
    });

    it("numbers an item with no summary yet", () => {
        expect(describe(fields, { events: [{ name: "" }] }, ["events", "0", "name"])).toBe("Events › event 1 › Name");
    });

    it("falls back to the raw path for an unknown field", () => {
        expect(describe(fields, {}, ["nope", "x"])).toBe("nope › x");
    });
});
