import Link from "next/link";

/** An unknown admin page, inside the admin shell, so the site's styles stay out of the panel. */
const AdminNotFound = () => (
    <div className="page-head">
        <h1>Not found</h1>
        <p>
            There&apos;s no admin page here. <Link href="/admin">Back to the sections</Link>.
        </p>
    </div>
);

export default AdminNotFound;
