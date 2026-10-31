import Link from "next/link";
import { Suspense } from "react";
import { sectionKeys } from "@/content/schema";
import { SECTIONS } from "./_editor/fields";
import { ownerOrSignIn } from "./_owner";

export const metadata = { title: "Content" };

const Overview = async () => {
    const session = await ownerOrSignIn("/admin");
    return (
        <>
            <p className="lede">
                Signed in as {session.user?.name ?? "the owner"}. Edits go live on the next page load; every save keeps
                the previous version, which you can restore from the section&apos;s history.
            </p>
            <ul className="sections">
                {sectionKeys.map((key) => (
                    <li key={key}>
                        <h2>
                            <Link href={`/admin/${key}`}>{SECTIONS[key].title}</Link>
                        </h2>
                        <p>{SECTIONS[key].description}</p>
                        <Link href={`/admin/${key}/revisions`}>
                            History<span className="sr-only"> of {SECTIONS[key].title}</span>
                        </Link>
                    </li>
                ))}
                <li>
                    <h2>
                        <Link href="/admin/assumed">Assumed facts</Link>
                    </h2>
                    <p>Every role, date and number marked as not confirmed yet.</p>
                </li>
            </ul>
        </>
    );
};

const AdminHome = () => (
    <>
        <h1>Content</h1>
        <Suspense fallback={<p>Loading…</p>}>
            <Overview />
        </Suspense>
    </>
);

export default AdminHome;
