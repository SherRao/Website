import type { Field } from "./fields";
import { slugify } from "./slug";

/** The editor's form state, without any React: reading and writing by path, and turning it into what gets saved. */

export type Path = (string | number)[];
export type Value = unknown;
export type Obj = Record<string, unknown>;
export const join = (path: Path, key: string | number): Path => (key === "" ? path : [...path, key]);
export const pathKey = (path: Path) => path.join(".");
export const fieldId = (path: Path) => `f-${path.join("-") || "root"}`;

export const getIn = (value: Value, path: Path): Value =>
    path.reduce<Value>((v, k) => (v == null ? undefined : (v as Obj)[k as string]), value);

export const setIn = (value: Value, path: Path, next: Value): Value => {
    if (!path.length) return next;
    const [head, ...rest] = path;
    if (Array.isArray(value)) {
        const copy = [...value];
        copy[head as number] = setIn(copy[head as number], rest, next);
        return copy;
    }
    const obj = (value ?? {}) as Obj;
    return { ...obj, [head]: setIn(obj[head as string], rest, next) };
};

/** Turns the form's state into what gets saved: blank optional fields are dropped, blank ids made from names. */
export const clean = (fields: Field[], value: Value): Value => {
    if (fields.length === 1 && fields[0].key === "") return cleanField(fields[0], value);
    const out: Obj = { ...((value as Obj) ?? {}) };
    for (const f of fields) {
        const v = cleanField(f, out[f.key], out);
        if (v === undefined) delete out[f.key];
        else out[f.key] = v;
    }
    return out;
};

const cleanField = (f: Field, v: Value, parent?: Obj): Value => {
    switch (f.kind) {
        case "text":
        case "number":
            return f.optional && (v === "" || v == null) ? undefined : v;
        case "slug":
            return v === "" || v == null ? slugify(parent?.[f.from]) : v;
        case "checkbox":
            return f.optional && !v ? undefined : Boolean(v);
        case "group":
            return clean(f.fields, v);
        case "list":
            return Array.isArray(v) ? v.map((item) => clean(f.fields, item)) : v;
        case "variant": {
            const option = variantOption(f, v);
            if (!option) return f.optional ? undefined : v;
            // Keep only the chosen shape's fields, so switching shapes doesn't save the old one's leftovers.
            const picked = Object.fromEntries(option.fields.map((o) => [o.key, (v as Obj)[o.key]]));
            return { kind: option.value, ...(clean(option.fields, picked) as Obj) };
        }
        case "placeholder": {
            const p = { ...((v as Obj) ?? {}) };
            for (const extra of f.extra ?? []) p[extra.key] = cleanField(extra, p[extra.key], p);
            if (p.needed)
                return {
                    needed: true,
                    hint: p.hint ?? "",
                    ...Object.fromEntries((f.extra ?? []).map((e) => [e.key, p[e.key]])),
                };
            const filled: Obj = { ...p, needed: false, details: p.details ?? "" };
            if (!filled.url) delete filled.url;
            if (!filled.hint) delete filled.hint;
            return filled;
        }
        default:
            return v;
    }
};

/** "Events › spurhacks 2025 › Name", for the error summary. */
export const describe = (fields: Field[], value: Value, path: string[]): string => {
    if (!path.length) return "";
    const rootList = fields.length === 1 && fields[0].key === "" ? fields[0] : undefined;
    const field = rootList ?? fields.find((f) => f.key === path[0]);
    if (!field) return path.join(" › ");
    const rest = rootList ? path : path.slice(1);
    const here = rootList ? value : (value as Obj | undefined)?.[field.key];
    const label = rootList ? "" : field.label;
    const parts = [label];
    if ((field.kind === "list" || field.kind === "strings") && rest.length) {
        const item = (here as Value[] | undefined)?.[Number(rest[0])];
        const name = field.kind === "list" ? String((item as Obj | undefined)?.[field.summary] || "") : "";
        parts.push(name || `${field.item} ${Number(rest[0]) + 1}`);
        if (field.kind === "list" && rest.length > 1) parts.push(describe(field.fields, item, rest.slice(1)));
    } else if (field.kind === "variant" && rest.length) {
        const option = variantOption(field, here);
        if (option) parts.push(describe(option.fields, here, rest));
    } else if ((field.kind === "group" || field.kind === "placeholder") && rest.length) {
        const sub = field.kind === "group" ? field.fields : [...(field.extra ?? []), ...placeholderFields];
        parts.push(describe(sub, here, rest));
    }
    return parts.filter(Boolean).join(" › ");
};

/** The variant option a value is, by its `kind`, if any. */
export const variantOption = (field: Extract<Field, { kind: "variant" }>, v: Value) =>
    field.options.find((o) => o.value === (v as Obj | undefined)?.kind);

/** A placeholder's fields: the hint while its content is needed, then the details and an optional link. */
export const placeholderHint: Extract<Field, { kind: "text" }> = { kind: "text", key: "hint", label: "Hint" };
export const placeholderFilled: Extract<Field, { kind: "text" }>[] = [
    { kind: "text", key: "details", label: "Details", multiline: true },
    { kind: "text", key: "url", label: "Link", optional: true, type: "url" },
];
const placeholderFields: Field[] = [placeholderHint, ...placeholderFilled];
