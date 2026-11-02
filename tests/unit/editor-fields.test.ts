import { describe, expect, it } from "vitest";
import { SECTIONS, type Field } from "@/app/admin/_editor/fields";
import { sectionKeys } from "@/content/schema";
import { fixtures } from "@/content/seed";

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
        expect(unreachable(SECTIONS[key].fields, fixtures[key], key)).toEqual([]);
    });

    it("notices a stored value with no field", () => {
        expect(unreachable([{ kind: "text", key: "a", label: "A" }], { a: "x", b: "y" }, "s")).toEqual(["s.b"]);
    });
});
