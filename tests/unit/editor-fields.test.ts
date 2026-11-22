import { describe, expect, it } from "vitest";
import { editorLayout, SECTIONS, UPLOAD_KINDS, type Field } from "@/content/editor-layout";
import { sectionKeys } from "@/content/schema";
import { fixtures } from "@/content/seed";
import { UPLOADS, uploadPathname } from "@/lib/upload-rules";

type Obj = Record<string, unknown>;

/** Keys the editor handles itself, not through a field of their own. */
const PLACEHOLDER_KEYS = ["needed", "hint", "details", "url"];

/** The paths of stored values that no editor field can reach. */
const unreachable = (fields: Field[], value: unknown, path: string, handled: string[] = []): string[] => {
    const root = fields.length === 1 && fields[0].key === "" ? fields[0] : undefined;
    if (root) return fieldGaps(root, value, path);
    return Object.entries((value ?? {}) as Obj).flatMap(([key, v]) => {
        if (handled.includes(key)) return [];
        const field = fields.find((f) => f.key === key);
        return field ? fieldGaps(field, v, `${path}.${key}`) : [`${path}.${key}`];
    });
};

const fieldGaps = (field: Field, value: unknown, path: string): string[] => {
    switch (field.kind) {
        case "group":
            return unreachable(field.fields, value, path);
        case "list":
            return (value as unknown[]).flatMap((item, i) => unreachable(field.fields, item, `${path}.${i}`));
        case "placeholder":
            return unreachable(field.extra ?? [], value, path, PLACEHOLDER_KEYS);
        case "variant": {
            const option = field.options.find((o) => o.value === (value as Obj | undefined)?.kind);
            return option ? unreachable(option.fields, value, path, ["kind"]) : [];
        }
        default:
            return [];
    }
};

describe("the admin editor", () => {
    it.each(sectionKeys)("can reach every stored value in %s", (key) => {
        expect(unreachable(editorLayout()[key].fields, fixtures[key], key)).toEqual([]);
    });

    it("notices a stored value with no field", () => {
        expect(unreachable([{ kind: "text", key: "a", label: "A" }], { a: "x", b: "y" }, "s")).toEqual(["s.b"]);
    });
});

/** Every field in a layout, nested ones included. */
const allFields = (fields: Field[]): Field[] =>
    fields.flatMap((f) => {
        switch (f.kind) {
            case "group":
            case "list":
                return [f, ...allFields(f.fields)];
            case "placeholder":
                return [f, ...allFields(f.extra ?? [])];
            case "variant":
                return [f, ...f.options.flatMap((o) => allFields(o.fields))];
            default:
                return [f];
        }
    });

describe("the editing layout", () => {
    it("is plain data, so it can be sent as JSON", () => {
        const layout = editorLayout();
        expect(JSON.parse(JSON.stringify(layout))).toEqual(layout);
        expect(JSON.parse(JSON.stringify(UPLOAD_KINDS))).toEqual(UPLOAD_KINDS);
    });

    it("starts a new fallback film in the year the layout is read", () => {
        const films = (year: number) => {
            const fields = editorLayout(new Date(`${year}-06-01T12:00:00Z`)).panels.fields;
            const list = fields.find((f) => f.key === "fallbackFilms");
            return list?.kind === "list" ? list.empty : undefined;
        };
        expect(films(2031)).toMatchObject({ year: 2031 });
        expect(films(2032)).toMatchObject({ year: 2032 });
    });

    it("titles every section", () => {
        const layout = editorLayout();
        for (const key of sectionKeys) expect(layout[key]).toMatchObject(SECTIONS[key]);
    });

    it("only names upload kinds it declares", () => {
        const named = sectionKeys.flatMap((key) =>
            allFields(editorLayout()[key].fields).flatMap((f) => (f.kind === "upload" ? [f.upload] : [])),
        );
        expect(named.length).toBeGreaterThan(0);
        for (const kind of named) expect(UPLOAD_KINDS).toHaveProperty(kind);
    });

    it.each(Object.keys(UPLOADS) as (keyof typeof UPLOADS)[])("has the upload route's rules for %s", (kind) => {
        const rule = UPLOADS[kind];
        expect(UPLOAD_KINDS[kind]).toEqual({
            types: [...rule.types],
            accept: rule.accept,
            maxBytes: rule.maxBytes,
            prefix: rule.prefix,
            extensions: rule.extensions,
            wrongType: rule.wrongType,
        });
        // A path built from the layout's rules passes the route's check, for every type it accepts.
        for (const type of UPLOAD_KINDS[kind].types) {
            const path = `${UPLOAD_KINDS[kind].prefix}/${crypto.randomUUID()}.${UPLOAD_KINDS[kind].extensions[type]}`;
            expect(rule.pathname.test(path)).toBe(true);
            expect(rule.pathname.test(uploadPathname(kind, type))).toBe(true);
        }
    });
});
