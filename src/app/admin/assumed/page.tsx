import Link from "next/link";
import { Suspense } from "react";
import { loadSection } from "@/content";
import { sectionKeys, type SectionKey } from "@/content/schema";
import { SECTIONS } from "../_editor/fields";
import { ownerOrSignIn } from "../_owner";

export const metadata = { title: "Assumed facts" };

type Found = { section: SectionKey; path: (string | number)[]; label: string };

const NAME_KEYS = ["name", "title", "org", "school", "label", "value"];

/** Every object in a section marked `assumed: true`. */
const findAssumed = (section: SectionKey, value: unknown, path: (string | number)[] = []): Found[] => {
    if (!value || typeof value !== "object") return [];
    if (Array.isArray(value)) return value.flatMap((v, i) => findAssumed(section, v, [...path, i]));
    const obj = value as Record<string, unknown>;
    const here: Found[] = [];
    if (obj.assumed === true) {
        const nameKey = NAME_KEYS.find((k) => typeof obj[k] === "string");
        const where = path.filter((p) => typeof p === "string").join(" › ");
        const name = nameKey ? String(obj[nameKey]) : "";
        here.push({ section, path, label: [where, name].filter(Boolean).join(": ") || section });
    }
    return [...here, ...Object.entries(obj).flatMap(([k, v]) => findAssumed(section, v, [...path, k]))];
};

const AssumedList = async () => {
    await ownerOrSignIn("/admin/assumed");
    const sections = await Promise.all(sectionKeys.map(async (key) => [key, await loadSection(key)] as const));
    const found = sections.flatMap(([key, data]) => findAssumed(key, data));
    if (!found.length) return <p>Nothing is marked assumed.</p>;
    return (
        <ul className="assumed">
            {found.map((f) => (
                <li key={`${f.section}-${f.path.join("-")}`}>
                    <span className="tag">{SECTIONS[f.section].title}</span>{" "}
                    <Link href={`/admin/${f.section}#f-${[...f.path, "assumed"].join("-")}`}>{f.label}</Link>
                </li>
            ))}
        </ul>
    );
};

const AssumedPage = () => (
    <>
        <div className="page-head">
            <h1>Assumed facts</h1>
            <p>Facts marked “assumed” (not confirmed yet). Confirm them, then clear the mark.</p>
        </div>
        <Suspense fallback={<p>Loading…</p>}>
            <AssumedList />
        </Suspense>
    </>
);

export default AssumedPage;
