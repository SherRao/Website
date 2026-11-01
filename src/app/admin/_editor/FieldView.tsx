import type { Ctx } from "./context";
import type { Field } from "./fields";
import {
    fieldId,
    getIn,
    join,
    pathKey,
    placeholderFilled,
    placeholderHint,
    variantOption,
    type Obj,
    type Path,
} from "./form-state";
import { CheckboxField, described, ErrorText, InputField } from "./inputs";
import { ListField, StringsField } from "./lists";

export const Fields = ({ fields, path, ctx }: { fields: Field[]; path: Path; ctx: Ctx }) => (
    <>
        {fields.map((f) => (
            <FieldView key={f.key || "root"} field={f} path={join(path, f.key)} ctx={ctx} />
        ))}
    </>
);

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
        case "variant":
            return <VariantField field={field} path={path} ctx={ctx} />;
        case "list":
            return <ListField field={field} path={path} ctx={ctx} />;
        case "strings":
            return <StringsField field={field} path={path} ctx={ctx} />;
    }
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
                hint="While this is on, the site shows the hint and a “coming soon” marker."
                path={[...path, "needed"]}
                ctx={ctx}
            />
            {(needed ? [placeholderHint] : placeholderFilled).map((f) => (
                <InputField key={f.key} field={f} path={[...path, f.key]} ctx={ctx} />
            ))}
            {field.extra && <Fields fields={field.extra} path={path} ctx={ctx} />}
        </fieldset>
    );
};

const VariantField = ({ field, path, ctx }: { field: Extract<Field, { kind: "variant" }>; path: Path; ctx: Ctx }) => {
    const v = getIn(ctx.value, path);
    const option = variantOption(field, v);
    const id = `${fieldId(path)}-kind`;
    const hintId = field.hint ? `${id}-hint` : undefined;
    return (
        <fieldset className="group" id={fieldId(path)} tabIndex={-1}>
            <legend>{field.label}</legend>
            <ErrorText id={fieldId(path)} text={ctx.errors[pathKey(path)]} />
            <div className="field">
                <label htmlFor={id}>Shows</label>
                {field.hint && (
                    <p className="hint" id={hintId}>
                        {field.hint}
                    </p>
                )}
                <select
                    id={id}
                    value={option?.value ?? ""}
                    aria-describedby={hintId}
                    onChange={(e) => {
                        const next = field.options.find((o) => o.value === e.target.value);
                        ctx.set(path, next ? { kind: next.value, ...next.empty() } : undefined);
                    }}
                >
                    {(field.optional || !option) && <option value="">{field.optional?.label ?? "(choose)"}</option>}
                    {field.options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>
            {option && <Fields fields={option.fields} path={path} ctx={ctx} />}
        </fieldset>
    );
};
