/** An id made from a name: "Montréal Fest" becomes "montreal-fest". Accents are dropped, not turned into dashes. */
export const slugify = (s: unknown) =>
    String(s ?? "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/\p{M}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
