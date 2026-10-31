/** Opens a link in a new tab, without handing the new page a reference back to this one. */
export const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

/** A link's target: other sites open in a new tab; links within the page ("#founder") don't. */
export const linkTarget = (href: string) => (href.startsWith("http") ? newTab : {});
