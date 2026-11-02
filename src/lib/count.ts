/** A count-up's text at `n`: its prefix, `n` with thousands separators, and its suffix. */
export const countText = (prefix: string, n: number, suffix: string) =>
    `${prefix}${n.toLocaleString("en-US")}${suffix}`;

/** Shows a count-up (a [data-count] element) at `n`, by default its final value. */
export const showCount = (el: HTMLElement, n = Number(el.dataset.count)) => {
    el.textContent = countText(el.dataset.prefix ?? "", n, el.dataset.suffix ?? "");
};
