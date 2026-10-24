import type { Metadata } from "next";
import Link from "next/link";
import { sectionKeys } from "@/content/schema";
import { SECTIONS } from "./_editor/fields";
import { signOutOwner } from "./actions";
import "./admin.css";

export const metadata: Metadata = {
    title: { template: "%s · admin", default: "admin" },
    robots: { index: false, follow: false },
};

/** The admin shell: section navigation and sign-out. Pages check the owner session themselves. */
const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <div className="admin">
        <a className="skip" href="#main">
            Skip to content
        </a>
        <header className="admin-head">
            <Link href="/admin" className="brand">
                content admin
            </Link>
            <nav aria-label="Admin">
                <ul>
                    {sectionKeys.map((key) => (
                        <li key={key}>
                            <Link href={`/admin/${key}`}>{SECTIONS[key].title}</Link>
                        </li>
                    ))}
                    <li>
                        <Link href="/admin/assumed">Assumed facts</Link>
                    </li>
                    <li>
                        <a href="/" target="_blank" rel="noopener noreferrer">
                            View site<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <form action={signOutOwner}>
                <button type="submit">Sign out</button>
            </form>
        </header>
        <main id="main" tabIndex={-1}>
            {children}
        </main>
    </div>
);

export default AdminLayout;
