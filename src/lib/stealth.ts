/**
 * The stealth company's words, from STEALTH_TERMS (comma-separated, never committed). The build's stealth scan
 * (scripts/stealth-scan.mjs, which reads them the same way) can't see content saved from the admin panel, since that
 * goes live without a build, so saves check it here.
 */
const stealthTerms = () =>
    (process.env.STEALTH_TERMS ?? "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

/** The paths ("founder.works.0.note") of every string in `data` that contains a stealth term. */
export const stealthMentions = (data: unknown): string[] => {
    const terms = stealthTerms();
    if (!terms.length) return [];
    const walk = (value: unknown, path: (string | number)[]): string[] => {
        if (typeof value === "string") {
            const text = value.toLowerCase();
            return terms.some((t) => text.includes(t)) ? [path.join(".")] : [];
        }
        if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => walk(v, [...path, k]));
        return [];
    };
    return walk(data, []);
};
