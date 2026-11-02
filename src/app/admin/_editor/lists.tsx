import { useState } from "react";
import type { Ctx } from "./context";
import { afterMove, afterRemove } from "./errors";
import type { Field } from "./fields";
import { Fields } from "./FieldView";
import { fieldId, getIn, pathKey, type Obj, type Path, type Value } from "./form-state";
import { ErrorText } from "./inputs";

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

let lastItemKey = 0;
const newItemKey = () => `item-${++lastItemKey}`;

const useListOps = (path: Path, ctx: Ctx) => {
    const items = (getIn(ctx.value, path) as Value[] | undefined) ?? [];
    // React keys that follow each item through moves and removes, so its state (an upload in progress) goes with it.
    const [keys, setKeys] = useState(() => items.map(() => newItemKey()));
    if (keys.length !== items.length) {
        // The list changed some other way: keep the keys we have and pad or trim the rest.
        setKeys([...keys.slice(0, items.length), ...items.slice(keys.length).map(() => newItemKey())]);
    }
    const reorder = <T,>(list: T[], from: number, to: number) => {
        const next = [...list];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
    };
    return {
        items,
        keys,
        move: (from: number, to: number) => {
            ctx.set(path, reorder(items, from, to));
            setKeys(reorder(keys, from, to));
            ctx.remapErrors(path, afterMove(from, to));
        },
        remove: (index: number) => {
            ctx.set(
                path,
                items.filter((_, i) => i !== index),
            );
            setKeys(keys.filter((_, i) => i !== index));
            ctx.remapErrors(path, afterRemove(index));
        },
        add: (item: Value) => {
            ctx.set(path, [...items, item]);
            setKeys([...keys, newItemKey()]);
        },
    };
};

export const ListField = ({ field, path, ctx }: { field: Extract<Field, { kind: "list" }>; path: Path; ctx: Ctx }) => {
    const { items, keys, move, remove, add } = useListOps(path, ctx);
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
                        <li key={keys[i]}>
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

export const StringsField = ({
    field,
    path,
    ctx,
}: {
    field: Extract<Field, { kind: "strings" }>;
    path: Path;
    ctx: Ctx;
}) => {
    const { items, keys, move, remove, add } = useListOps(path, ctx);
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
                        <li key={keys[i]} className="string-row">
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
