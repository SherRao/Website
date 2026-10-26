import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getRepository } from "@/content/repository";
import { isSectionKey, sectionKeys } from "@/content/schema";
import { restoreRevision } from "../../actions";
import { SECTIONS } from "../../_editor/fields";
import { ownerOrSignIn } from "../../_owner";

type Props = {
    params: Promise<{ section: string }>;
    searchParams: Promise<{ restored?: string; error?: string; page?: string }>;
};

export const generateStaticParams = () => sectionKeys.map((section) => ({ section }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { section } = await params;
    return { title: isSectionKey(section) ? `${SECTIONS[section].title} history` : "Not found" };
};

const MAX_CHANGES = 6;
const PER_PAGE = 20;

/** The leaf paths where two versions differ, with the value in `a`. Walks each version once. */
const differences = (a: unknown, b: unknown, path: string[] = []): { path: string; value: unknown }[] => {
    if (a === b) return [];
    const bothObjects = a && b && typeof a === "object" && typeof b === "object";
    if (!bothObjects || Array.isArray(a) !== Array.isArray(b))
        return [{ path: path.join(".") || "(everything)", value: a }];
    const keys = new Set([...Object.keys(a as object), ...Object.keys(b as object)]);
    return [...keys].flatMap((k) =>
        differences((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], [...path, k]),
    );
};

const show = (v: unknown) => {
    const text = v === undefined ? "(not set)" : typeof v === "string" ? `“${v}”` : JSON.stringify(v);
    return text.length > 90 ? `${text.slice(0, 89)}…` : text;
};

// The owner is in Waterloo, so times show in Eastern time.
const when = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "long",
    timeZone: "America/Toronto",
});
const format = (d: Date) => when.format(d);

const Revisions = async ({ params, searchParams }: Props) => {
    const { section } = await params;
    if (!isSectionKey(section)) notFound();
    await ownerOrSignIn(`/admin/${section}/revisions`);
    const { restored, error, page: pageParam } = await searchParams;
    const page = Math.max(1, Math.floor(Number(pageParam)) || 1);
    const repo = await getRepository();
    // One more than a page, to tell whether there are older versions.
    const [current, listed] = await Promise.all([
        repo.get(section),
        repo.listRevisions(section, { limit: PER_PAGE + 1, offset: (page - 1) * PER_PAGE }),
    ]);
    const revisions = listed.slice(0, PER_PAGE);
    const hasOlder = listed.length > PER_PAGE;
    const pageHref = (n: number) => `/admin/${section}/revisions${n > 1 ? `?page=${n}` : ""}`;
    const title = SECTIONS[section].title;

    return (
        <>
            <div className="page-head">
                <h1>{title} history</h1>
                <p>
                    Each entry is the version a save replaced, with what differs from the current content. Restoring one
                    makes it current, and keeps what it replaces here too.
                </p>
                <Link href={`/admin/${section}`}>Edit {title}</Link>
            </div>
            {restored && (
                <p role="status" className="notice">
                    Restored. It&apos;s live on the next page load.
                </p>
            )}
            {error && (
                <p role="alert" className="field-error">
                    {error}
                </p>
            )}
            {revisions.length === 0 ? (
                <p>{page > 1 ? "No versions this far back." : "No earlier versions yet. Each save adds one."}</p>
            ) : (
                <ol className="revisions">
                    {revisions.map((r) => {
                        const changes = differences(r.data, current);
                        return (
                            <li key={r.id}>
                                <h2>
                                    <time dateTime={r.createdAt.toISOString()}>{format(r.createdAt)}</time>
                                </h2>
                                {changes.length === 0 ? (
                                    <p>Same as the current content.</p>
                                ) : (
                                    <ul className="changes">
                                        {changes.slice(0, MAX_CHANGES).map((c) => (
                                            <li key={c.path}>
                                                <code translate="no">{c.path}</code>: {show(c.value)}
                                            </li>
                                        ))}
                                        {changes.length > MAX_CHANGES && (
                                            <li>and {changes.length - MAX_CHANGES} more changes</li>
                                        )}
                                    </ul>
                                )}
                                <form action={restoreRevision.bind(null, section, r.id)}>
                                    <button type="submit">
                                        Restore<span className="sr-only"> the version from {format(r.createdAt)}</span>
                                    </button>
                                </form>
                            </li>
                        );
                    })}
                </ol>
            )}
            {(page > 1 || hasOlder) && (
                <nav className="pager" aria-label="History pages">
                    {page > 1 && <Link href={pageHref(page - 1)}>Newer versions</Link>}
                    {hasOlder && <Link href={pageHref(page + 1)}>Older versions</Link>}
                </nav>
            )}
        </>
    );
};

const RevisionsPage = (props: Props) => (
    <Suspense fallback={<p>Loading…</p>}>
        <Revisions {...props} />
    </Suspense>
);

export default RevisionsPage;
