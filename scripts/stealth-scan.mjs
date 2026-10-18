// Fails the build if the stealth company's name or details appear anywhere in what gets shipped.
// The words to look for come from STEALTH_TERMS (comma-separated) so they are never committed.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const terms = (process.env.STEALTH_TERMS ?? "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
if (terms.length === 0) {
    console.warn("stealth scan: STEALTH_TERMS is not set, skipping. Set it locally and in CI.");
    process.exit(0);
}

const roots = (process.argv.slice(2).length ? process.argv.slice(2) : [".next", "public"]).filter((r) => {
    try { return statSync(r).isDirectory(); } catch { return false; }
});
const skipDirs = new Set(["cache"]);
const textLike = /\.(html|js|mjs|cjs|json|css|txt|map|xml|svg|md|rsc|body|meta)$/i;
const hits = [];

const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!skipDirs.has(entry.name)) walk(full);
        } else if (textLike.test(entry.name) || !path.extname(entry.name)) {
            const text = readFileSync(full, "utf8").toLowerCase();
            for (const term of terms) if (text.includes(term)) hits.push(`${full}: "${term}"`);
        }
    }
};
roots.forEach(walk);

if (hits.length) {
    console.error(`stealth scan: found ${hits.length} match(es):\n  ${hits.join("\n  ")}`);
    process.exit(1);
}
console.log(`stealth scan: clean (${terms.length} term(s), ${roots.join(", ")})`);
