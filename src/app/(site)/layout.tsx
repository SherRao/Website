import { Loader } from "@/components/Loader";
import { getName } from "@/content";
import "./globals.css";

/** The public site: its styles and the opening stage cue. The admin panel has its own. */
const SiteLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <>
        <Loader name={await getName()} />
        {children}
    </>
);

export default SiteLayout;
