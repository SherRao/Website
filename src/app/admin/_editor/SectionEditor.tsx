"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { SectionKey } from "@/content/schema";
import { UPLOADS, uploadPathname, uploadProblem, type UploadKind } from "@/lib/upload-rules";
import { saveSection } from "../actions";
import { SECTIONS, type Field } from "./fields";

type Path = (string | number)[];
type Value = unknown;
type Obj = Record<string, unknown>;
export type UploadMode = "blob" | "local" | "off";

const join = (path: Path, key: string | number): Path => (key === "" ? path : [...path, key]);
const pathKey = (path: Path) => path.join(".");
const fieldId = (path: Path) => `f-${path.join("-") || "root"}`;

const getIn = (value: Value, path: Path): Value =>
    path.reduce<Value>((v, k) => (v == null ? undefined : (v as Obj)[k as string]), value);

const setIn = (value: Value, path: Path, next: Value): Value => {
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

const slugify = (s: unknown) =>
    String(s ?? "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

/** Turns the form's state into what gets saved: blank optional fields are dropped, blank ids made from names. */
const clean = (fields: Field[], value: Value): Value => {
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
            return f.optional && (v === "" || v == null) ? undefined : v;
        case "slug":
            return v === "" || v == null ? slugify(parent?.[f.from]) : v;
        case "checkbox":
            return f.optional && !v ? undefined : Boolean(v);
        case "group":
            return clean(f.fields, v);
        case "list":
            return Array.isArray(v) ? v.map((item) => clean(f.fields, item)) : v;
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
const describe = (fields: Field[], value: Value, path: string[]): string => {
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
    } else if ((field.kind === "group" || field.kind === "placeholder") && rest.length) {
        const sub = field.kind === "group" ? field.fields : [...(field.extra ?? []), ...placeholderFields];
        parts.push(describe(sub, here, rest));
    }
    return parts.filter(Boolean).join(" › ");
};

const placeholderFields: Field[] = [
    { kind: "text", key: "hint", label: "Hint" },
    { kind: "text", key: "details", label: "Details" },
    { kind: "text", key: "url", label: "Link" },
];

type Ctx = {
    value: Value;
    errors: Record<string, string>;
    set: (path: Path, v: Value) => void;
    focusLater: (id: string) => void;
    announce: (msg: string) => void;
    productOptions: { id: string; name: string }[];
    uploadMode: UploadMode;
};

type SectionEditorProps = {
    section: SectionKey;
    initial: Value;
    productOptions: { id: string; name: string }[];
    uploadMode: UploadMode;
};

/** The form for one content section. Saving sends the whole section; the server validates it against the schema. */
export const SectionEditor = ({ section, initial, productOptions, uploadMode }: SectionEditorProps) => {
    const { fields } = SECTIONS[section];
    const [value, setValue] = useState<Value>(initial);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [summary, setSummary] = useState<{ message: string; items: { path: string; message: string }[] } | null>(
        null,
    );
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [announcement, setAnnouncement] = useState("");
    const pendingFocus = useRef<string | null>(null);
    // False in the server HTML, true once hydrated: until then Save is off, so it can't submit the form natively.
    const hydrated = useSyncExternalStore(
        noSubscribe,
        () => true,
        () => false,
    );
    const summaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pendingFocus.current) return;
        document.getElementById(pendingFocus.current)?.focus();
        pendingFocus.current = null;
    });

    useEffect(() => {
        if (!dirty) return;
        const warn = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    useEffect(() => {
        if (summary) summaryRef.current?.focus();
    }, [summary]);

    const ctx: Ctx = {
        value,
        errors,
        set: (path, v) => {
            setValue((old: Value) => setIn(old, path, v));
            setDirty(true);
            setStatus("");
        },
        focusLater: (id) => (pendingFocus.current = id),
        announce: setAnnouncement,
        productOptions,
        uploadMode,
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus("Saving…");
        const data = clean(fields, value);
        try {
            const result = await saveSection(section, data);
            if (result.ok) {
                setValue(data);
                setErrors({});
                setSummary(null);
                setDirty(false);
                setStatus("Saved. It's live on the next page load.");
            } else {
                setErrors(Object.fromEntries(result.fieldErrors.map((f) => [f.path, f.message])));
                setSummary({ message: result.message, items: result.fieldErrors });
                setStatus("");
            }
        } catch {
            setStatus("");
            setSummary({ message: "The save didn't go through. Check your connection and try again.", items: [] });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="editor" onSubmit={onSubmit} noValidate data-hydrated={hydrated || undefined}>
            {summary && (
                <div
                    className="error-summary"
                    role="alert"
                    tabIndex={-1}
                    ref={summaryRef}
                    aria-labelledby="error-summary-title"
                >
                    <h2 id="error-summary-title">{summary.message}</h2>
                    {summary.items.length > 0 && (
                        <ul>
                            {summary.items.map((item) => {
                                const where = describe(fields, value, item.path ? item.path.split(".") : []);
                                return (
                                    <li key={item.path + item.message}>
                                        {item.path ? (
                                            <a href={`#${fieldId(item.path.split("."))}`}>
                                                {where}: {item.message}
                                            </a>
                                        ) : (
                                            <span>
                                                {where ? `${where}: ` : ""}
                                                {item.message}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}

            <Fields fields={fields} path={[]} ctx={ctx} />

            <div className="savebar">
                <button type="submit" className="primary" disabled={saving || !hydrated}>
                    {saving ? "Saving…" : "Save"}
                </button>
                <p role="status" className="status">
                    {status || (dirty ? "Unsaved changes." : "")}
                </p>
            </div>
            <p className="sr-only" aria-live="polite">
                {announcement}
            </p>
        </form>
    );
};

const noSubscribe = () => () => {};

const Fields = ({ fields, path, ctx }: { fields: Field[]; path: Path; ctx: Ctx }) => (
    <>
        {fields.map((f) => (
            <FieldView key={f.key || "root"} field={f} path={join(path, f.key)} ctx={ctx} />
        ))}
    </>
);

/** Label, hint and error ids for one input. */
const described = (path: Path, ctx: Ctx, hint?: string) => {
    const id = fieldId(path);
    const error = ctx.errors[pathKey(path)];
    const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
    return { id, error, describedBy };
};

const Hint = ({ id, text }: { id: string; text?: string }) =>
    text ? (
        <p className="hint" id={`${id}-hint`}>
            {text}
        </p>
    ) : null;
const ErrorText = ({ id, text }: { id: string; text?: string }) =>
    text ? (
        <p className="field-error" id={`${id}-error`}>
            {text}
        </p>
    ) : null;

const FieldView = ({ field, path, ctx }: { field: Field; path: Path; ctx: Ctx }) => {
    switch (field.kind) {
        case "text":
        case "slug":
        case "number":
        case "upload":
            return <InputField field={field} path={path} ctx={ctx} />;
        case "checkbox": {
            return <CheckboxField label={field.label} hint={field.hint} path={path} ctx={ctx} />;
        }
        case "select": {
            const { id, error, describedBy } = described(path, ctx);
            const v = getIn(ctx.value, path);
            return (
                <div className="field">
                    <label htmlFor={id}>{field.label}</label>
                    <select
                        id={id}
                        value={String(v ?? "")}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        onChange={(e) => {
                            const option = field.options.find((o) => String(o.value) === e.target.value);
                            ctx.set(path, option ? option.value : e.target.value);
                        }}
                    >
                        {field.options.map((o) => (
                            <option key={o.value} value={String(o.value)}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                    <ErrorText id={id} text={error} />
                </div>
            );
        }
        case "productRef": {
            const { id, error, describedBy } = described(path, ctx, field.hint);
            const v = String(getIn(ctx.value, path) ?? "");
            const known = ctx.productOptions.some((p) => p.id === v);
            return (
                <div className="field">
                    <label htmlFor={id}>{field.label}</label>
                    <Hint id={id} text={field.hint} />
                    <select
                        id={id}
                        value={v}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        onChange={(e) => ctx.set(path, e.target.value)}
                    >
                        {!known && <option value={v}>{v || "(none)"} (missing)</option>}
                        {ctx.productOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <ErrorText id={id} text={error} />
                </div>
            );
        }
        case "group":
            return (
                <fieldset className="group" id={fieldId(path)} tabIndex={-1}>
                    <legend>{field.label}</legend>
                    <ErrorText id={fieldId(path)} text={ctx.errors[pathKey(path)]} />
                    <Fields fields={field.fields} path={path} ctx={ctx} />
                </fieldset>
            );
        case "placeholder":
            return <PlaceholderField field={field} path={path} ctx={ctx} />;
        case "list":
            return <ListField field={field} path={path} ctx={ctx} />;
        case "strings":
            return <StringsField field={field} path={path} ctx={ctx} />;
    }
};

const CheckboxField = ({ label, hint, path, ctx }: { label: string; hint?: string; path: Path; ctx: Ctx }) => {
    const { id, error, describedBy } = described(path, ctx, hint);
    return (
        <div className="field checkbox">
            <input
                type="checkbox"
                id={id}
                checked={Boolean(getIn(ctx.value, path))}
                aria-describedby={describedBy}
                aria-invalid={error ? true : undefined}
                onChange={(e) => ctx.set(path, e.target.checked)}
            />
            <label htmlFor={id}>{label}</label>
            <Hint id={id} text={hint} />
            <ErrorText id={id} text={error} />
        </div>
    );
};

type InputFieldProps = { field: Extract<Field, { kind: "text" | "slug" | "number" | "upload" }>; path: Path; ctx: Ctx };

const InputField = ({ field, path, ctx }: InputFieldProps) => {
    const hint = "hint" in field ? field.hint : undefined;
    const { id, error, describedBy } = described(path, ctx, hint);
    const v = getIn(ctx.value, path);
    const common = {
        id,
        name: pathKey(path),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
    };
    const optional = field.kind === "text" && field.optional;
    return (
        <div className="field">
            <label htmlFor={id}>
                {field.label}
                {optional && <span className="optional"> (optional)</span>}
            </label>
            <Hint id={id} text={hint} />
            {field.kind === "text" && field.multiline ? (
                <textarea
                    {...common}
                    rows={3}
                    value={String(v ?? "")}
                    onChange={(e) => ctx.set(path, e.target.value)}
                />
            ) : field.kind === "number" ? (
                <input
                    {...common}
                    type="number"
                    inputMode="decimal"
                    step={field.step ?? 1}
                    value={v === undefined || v === null ? "" : String(v)}
                    onChange={(e) => {
                        const raw = e.target.value;
                        const n = Number(raw);
                        ctx.set(path, raw === "" || Number.isNaN(n) ? raw : n);
                    }}
                />
            ) : (
                <input
                    {...common}
                    type={field.kind === "text" && field.type ? field.type : "text"}
                    autoComplete="off"
                    spellCheck={field.kind === "text" && !field.type}
                    value={String(v ?? "")}
                    onChange={(e) => ctx.set(path, e.target.value)}
                />
            )}
            <ErrorText id={id} text={error} />
            {field.kind === "upload" && <UploadButton kind={field.upload} path={path} ctx={ctx} label={field.label} />}
        </div>
    );
};

const toSafePreviewSrc = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    // Disallow control characters to avoid parser ambiguities.
    if (/[\u0000-\u001F\u007F]/.test(trimmed)) return "";

    // Allow only root-relative paths (not protocol-relative //...).
    if (trimmed.startsWith("/")) {
        if (trimmed.startsWith("//")) return "";
        return trimmed;
    }

    try {
        const u = new URL(trimmed);
        if (u.protocol !== "http:" && u.protocol !== "https:") return "";
        // Do not allow embedded credentials in preview URLs.
        if (u.username || u.password) return "";
        return u.toString();
    } catch {
        return "";
    }
};

const UploadButton = ({ kind, path, ctx, label }: { kind: UploadKind; path: Path; ctx: Ctx; label: string }) => {
    const inputId = useId();
    const [state, setState] = useState<{ busy: boolean; message: string; error: boolean }>({
        busy: false,
        message: "",
        error: false,
    });
    const current = String(getIn(ctx.value, path) ?? "");
    const safePreviewSrc = toSafePreviewSrc(current);
    const verb = kind === "resume" ? "Upload a PDF" : "Upload a photo";

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        const problem = uploadProblem(kind, file);
        if (problem) return setState({ busy: false, message: `Not uploaded: ${problem}`, error: true });
        setState({ busy: true, message: "Uploading…", error: false });
        try {
            let url: string;
            if (ctx.uploadMode === "blob") {
                const blob = await upload(uploadPathname(kind, file.type), file, {
                    access: "public",
                    handleUploadUrl: "/admin/upload",
                    clientPayload: kind,
                    contentType: file.type,
                });
                url = blob.url;
            } else {
                const form = new FormData();
                form.set("kind", kind);
                form.set("file", file);
                const res = await fetch("/admin/upload", { method: "POST", body: form });
                const body = (await res.json()) as { url?: string; error?: string };
                if (!res.ok || !body.url) throw new Error(body.error ?? "Upload failed");
                url = body.url;
            }
            ctx.set(path, url);
            setState({ busy: false, message: "Uploaded. Save to publish it.", error: false });
        } catch (error) {
            setState({ busy: false, message: `Not uploaded: ${(error as Error).message}`, error: true });
        }
    };

    if (ctx.uploadMode === "off") {
        return <p className="hint">Uploads need file storage (BLOB_READ_WRITE_TOKEN). You can still enter a /path or a Blob URL.</p>;
    }
    return (
        <div className="upload">
            {kind === "photo" && safePreviewSrc && (
                // Previews may come from any host the owner pastes, so this skips next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={safePreviewSrc} alt="" className="preview" width={96} height={64} />
            )}
            <label htmlFor={inputId} className="button">
                {state.busy ? "Uploading…" : verb}
                <span className="sr-only"> for {label}</span>
            </label>
            <input
                id={inputId}
                type="file"
                className="file-input"
                accept={UPLOADS[kind].accept}
                disabled={state.busy}
                onChange={onFile}
            />
            <p className={state.error ? "field-error" : "hint"} role={state.error ? "alert" : "status"}>
                {state.message}
            </p>
        </div>
    );
};

const PlaceholderField = ({
    field,
    path,
    ctx,
}: {
    field: Extract<Field, { kind: "placeholder" }>;
    path: Path;
    ctx: Ctx;
}) => {
    const v = (getIn(ctx.value, path) ?? {}) as Obj;
    const needed = Boolean(v.needed);
    return (
        <fieldset className="group" id={fieldId(path)} tabIndex={-1}>
            <legend>{field.label}</legend>
            <CheckboxField
                label="Content needed"
                hint="While this is on, the site shows the hint and a “content needed” marker."
                path={[...path, "needed"]}
                ctx={ctx}
            />
            {needed ? (
                <InputField field={{ kind: "text", key: "hint", label: "Hint" }} path={[...path, "hint"]} ctx={ctx} />
            ) : (
                <>
                    <InputField
                        field={{ kind: "text", key: "details", label: "Details", multiline: true }}
                        path={[...path, "details"]}
                        ctx={ctx}
                    />
                    <InputField
                        field={{ kind: "text", key: "url", label: "Link", optional: true, type: "url" }}
                        path={[...path, "url"]}
                        ctx={ctx}
                    />
                </>
            )}
            {field.extra && <Fields fields={field.extra} path={path} ctx={ctx} />}
        </fieldset>
    );
};

/** Up, down and remove for one item in a list. */
const ItemControls = ({
    path,
    index,
    count,
    name,
    ctx,
    move,
    remove,
}: {
    path: Path;
    index: number;
    count: number;
    name: string;
    ctx: Ctx;
    move: (from: number, to: number) => void;
    remove: (index: number) => void;
}) => {
    const id = fieldId([...path, index]);
    return (
        <div className="item-controls">
            <button
                type="button"
                id={`${id}-up`}
                disabled={index === 0}
                aria-label={`Move up: ${name}`}
                onClick={() => {
                    move(index, index - 1);
                    ctx.focusLater(
                        index - 1 === 0 ? `${fieldId([...path, 0])}-down` : `${fieldId([...path, index - 1])}-up`,
                    );
                    ctx.announce(`Moved ${name} to position ${index} of ${count}.`);
                }}
            >
                Move up
            </button>
            <button
                type="button"
                id={`${id}-down`}
                disabled={index === count - 1}
                aria-label={`Move down: ${name}`}
                onClick={() => {
                    move(index, index + 1);
                    ctx.focusLater(
                        index + 1 === count - 1
                            ? `${fieldId([...path, index + 1])}-up`
                            : `${fieldId([...path, index + 1])}-down`,
                    );
                    ctx.announce(`Moved ${name} to position ${index + 2} of ${count}.`);
                }}
            >
                Move down
            </button>
            <button
                type="button"
                className="danger"
                aria-label={`Remove: ${name}`}
                onClick={() => {
                    remove(index);
                    ctx.focusLater(
                        count > 1 ? `${fieldId([...path, Math.max(0, index - 1)])}-legend` : `${fieldId(path)}-add`,
                    );
                    ctx.announce(`Removed ${name}. Save to publish, or reload to undo.`);
                }}
            >
                Remove
            </button>
        </div>
    );
};

const useListOps = (path: Path, ctx: Ctx) => {
    const items = (getIn(ctx.value, path) as Value[] | undefined) ?? [];
    return {
        items,
        move: (from: number, to: number) => {
            const next = [...items];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            ctx.set(path, next);
        },
        remove: (index: number) =>
            ctx.set(
                path,
                items.filter((_, i) => i !== index),
            ),
        add: (item: Value) => ctx.set(path, [...items, item]),
    };
};

const ListField = ({ field, path, ctx }: { field: Extract<Field, { kind: "list" }>; path: Path; ctx: Ctx }) => {
    const { items, move, remove, add } = useListOps(path, ctx);
    const listId = fieldId(path);
    const error = ctx.errors[pathKey(path)];
    return (
        <fieldset className="list" id={listId} tabIndex={-1}>
            <legend>
                {field.label} <span className="count">({items.length})</span>
            </legend>
            <ErrorText id={listId} text={error} />
            <ol>
                {items.map((item, i) => {
                    const name = String((item as Obj)?.[field.summary] || "") || `${field.item} ${i + 1}`;
                    const itemPath = [...path, i];
                    return (
                        <li key={i}>
                            <fieldset className="item">
                                <legend id={`${fieldId(itemPath)}-legend`} tabIndex={-1}>
                                    {i + 1}. {name}
                                </legend>
                                <ItemControls
                                    path={path}
                                    index={i}
                                    count={items.length}
                                    name={name}
                                    ctx={ctx}
                                    move={move}
                                    remove={remove}
                                />
                                <Fields fields={field.fields} path={itemPath} ctx={ctx} />
                            </fieldset>
                        </li>
                    );
                })}
            </ol>
            <button
                type="button"
                id={`${listId}-add`}
                onClick={() => {
                    add(field.empty());
                    const first = field.fields[0];
                    ctx.focusLater(fieldId([...path, items.length, first.key]));
                    ctx.announce(`Added ${field.item} ${items.length + 1}.`);
                }}
            >
                Add {field.item}
            </button>
        </fieldset>
    );
};

const StringsField = ({ field, path, ctx }: { field: Extract<Field, { kind: "strings" }>; path: Path; ctx: Ctx }) => {
    const { items, move, remove, add } = useListOps(path, ctx);
    const listId = fieldId(path);
    return (
        <fieldset className="list strings" id={listId} tabIndex={-1}>
            <legend>{field.label}</legend>
            <ErrorText id={listId} text={ctx.errors[pathKey(path)]} />
            <ol>
                {items.map((item, i) => {
                    const name = String(item || "") || `${field.item} ${i + 1}`;
                    const itemPath = [...path, i];
                    const id = fieldId(itemPath);
                    const error = ctx.errors[pathKey(itemPath)];
                    return (
                        <li key={i} className="string-row">
                            <label htmlFor={id} className="sr-only">
                                {field.item} {i + 1}
                            </label>
                            <span id={`${id}-legend`} tabIndex={-1} className="sr-only">
                                {name}
                            </span>
                            <input
                                id={id}
                                value={String(item ?? "")}
                                aria-invalid={error ? true : undefined}
                                aria-describedby={error ? `${id}-error` : undefined}
                                onChange={(e) => ctx.set(itemPath, e.target.value)}
                            />
                            <ItemControls
                                path={path}
                                index={i}
                                count={items.length}
                                name={name}
                                ctx={ctx}
                                move={move}
                                remove={remove}
                            />
                            <ErrorText id={id} text={error} />
                        </li>
                    );
                })}
            </ol>
            <button
                type="button"
                id={`${listId}-add`}
                onClick={() => {
                    add("");
                    ctx.focusLater(fieldId([...path, items.length]));
                }}
            >
                Add {field.item}
            </button>
        </fieldset>
    );
};
