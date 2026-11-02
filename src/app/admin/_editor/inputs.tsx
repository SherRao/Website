import type { Ctx } from "./context";
import type { Field } from "./fields";
import { fieldId, getIn, pathKey, type Path } from "./form-state";
import { UploadButton } from "./UploadButton";

/** Label, hint and error ids for one input. */
export const described = (path: Path, ctx: Ctx, hint?: string) => {
    const id = fieldId(path);
    const error = ctx.errors[pathKey(path)];
    const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
    return { id, error, describedBy };
};

export const Hint = ({ id, text }: { id: string; text?: string }) =>
    text ? (
        <p className="hint" id={`${id}-hint`}>
            {text}
        </p>
    ) : null;
export const ErrorText = ({ id, text }: { id: string; text?: string }) =>
    text ? (
        <p className="field-error" id={`${id}-error`}>
            {text}
        </p>
    ) : null;

export const CheckboxField = ({ label, hint, path, ctx }: { label: string; hint?: string; path: Path; ctx: Ctx }) => {
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

export const InputField = ({ field, path, ctx }: InputFieldProps) => {
    const hint = "hint" in field ? field.hint : undefined;
    const { id, error, describedBy } = described(path, ctx, hint);
    const v = getIn(ctx.value, path);
    const common = {
        id,
        name: pathKey(path),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
    };
    const optional = (field.kind === "text" || field.kind === "number") && field.optional;
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
