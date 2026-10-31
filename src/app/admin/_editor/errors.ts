/**
 * Moves field errors with their list items. Errors are keyed by index path ("jobs.2.org"), so when a list's items
 * move or are removed, each error under the list follows its item to its new index (`to` gives it), and an error
 * whose item was removed (`to` gives undefined) is dropped. Errors outside the list are kept as they are.
 */
export const remapListErrors = <E extends { path: string }>(
    errors: E[],
    list: string,
    to: (index: number) => number | undefined,
): E[] => {
    const prefix = list ? `${list}.` : "";
    return errors.flatMap((error) => {
        if (!error.path.startsWith(prefix)) return [error];
        const [index, ...rest] = error.path.slice(prefix.length).split(".");
        if (!/^\d+$/.test(index)) return [error];
        const next = to(Number(index));
        return next === undefined ? [] : [{ ...error, path: [`${prefix}${next}`, ...rest].join(".") }];
    });
};

/** Where each index goes when the item at `from` moves to `to`. */
export const afterMove = (from: number, to: number) => (i: number) => {
    if (i === from) return to;
    if (from < to && i > from && i <= to) return i - 1;
    if (to < from && i >= to && i < from) return i + 1;
    return i;
};

/** Where each index goes when the item at `removed` is removed: later items move up one, and it's gone. */
export const afterRemove = (removed: number) => (i: number) => (i === removed ? undefined : i > removed ? i - 1 : i);
