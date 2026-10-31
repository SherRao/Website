import type { Metadata } from "next";
import Link from "next/link";
import { Followspot } from "@/components/Followspot";
import { Loader } from "@/components/Loader";
import { PageMotion } from "@/components/PageMotion";
// The site's layout doesn't wrap this page (it sits above the route groups), so it brings the site's styles itself.
import "./(site)/globals.css";

export const metadata: Metadata = { title: "Page not found: Nausher Rao" };

/** The 404: the followspot's lamp has blown, so the stage is dark. */
const NotFound = () => (
    <>
        <Loader />
        <main className="panel lost">
            <div>
                <Followspot mood="out" className="lost-spot" />
                <p className="label-s">cue 404</p>
                <h1 className="lost-title display">the lamp blew.</h1>
                <p className="lost-text">
                    there&apos;s nothing on this mark. the page you&apos;re after moved, or it was never on the cue
                    sheet.
                </p>
                <Link className="lost-home" href="/">
                    back to the top
                </Link>
            </div>
            <PageMotion />
        </main>
    </>
);

export default NotFound;
