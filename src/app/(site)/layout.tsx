import { Loader } from "@/components/Loader";
import "./globals.css";

/** The public site: its styles and the opening stage cue. The admin panel has its own. */
const SiteLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <>
        <Loader />
        {children}
    </>
);

export default SiteLayout;
