import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { loadSectionForEditing } from "@/content";
import { canSaveContent, READ_ONLY_MESSAGE } from "@/content/repository";
import { isSectionKey, sectionKeys } from "@/content/schema";
import { blobConfigured, localUploadsEnabled } from "@/lib/local-uploads";
import { SectionEditor } from "../_editor/SectionEditor";
import { SECTIONS } from "../_editor/fields";
import { ownerOrSignIn } from "../_owner";

type Props = { params: Promise<{ section: string }> };

export const generateStaticParams = () => sectionKeys.map((section) => ({ section }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { section } = await params;
    return { title: isSectionKey(section) ? SECTIONS[section].title : "Not found" };
};

/** The products founder works can point at, read leniently so an invalid Products section doesn't block editing. */
const productOptions = (products: unknown) =>
    (Array.isArray(products) ? products : []).flatMap((p) =>
        p && typeof p.id === "string" ? [{ id: p.id, name: typeof p.name === "string" && p.name ? p.name : p.id }] : [],
    );

/**
 * Reads the latest content straight from the store (not the site's cache), so the form starts from what's saved. A
 * section that fails its schema still opens, with the problems shown, so it can be fixed here.
 */
const Editor = async ({ params }: Props) => {
    const { section } = await params;
    if (!isSectionKey(section)) notFound();
    await ownerOrSignIn(`/admin/${section}`);
    const [current, products] = await Promise.all([loadSectionForEditing(section), loadSectionForEditing("products")]);
    return (
        <SectionEditor
            section={section}
            initial={current.data}
            initialIssues={current.issues}
            missing={current.missing}
            productOptions={productOptions(products.data)}
            readOnly={canSaveContent() ? undefined : READ_ONLY_MESSAGE}
            uploadMode={blobConfigured() ? "blob" : localUploadsEnabled() ? "local" : "off"}
        />
    );
};

const Heading = async ({ params }: Props) => {
    const { section } = await params;
    if (!isSectionKey(section)) notFound();
    return (
        <div className="page-head">
            <h1>{SECTIONS[section].title}</h1>
            <p>{SECTIONS[section].description}</p>
            <Link href={`/admin/${section}/revisions`}>History</Link>
        </div>
    );
};

const SectionPage = ({ params }: Props) => (
    <>
        <Suspense fallback={<h1>Section</h1>}>
            <Heading params={params} />
        </Suspense>
        <Suspense fallback={<p>Loading…</p>}>
            <Editor params={params} />
        </Suspense>
    </>
);

export default SectionPage;
