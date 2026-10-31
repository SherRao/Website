import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getProfile } from "@/content";

// Share image in the site's style: the name lit on the dark grid. Swap for a photo once one is supplied.
// Next.js needs the alt text as a constant, so it describes the image rather than repeating the page title.
export const alt = "Nausher Rao's name, lit on a dark grid";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const display = await readFile(join(process.cwd(), "src/app/fonts/antique-olive-black.ttf"));

const grid =
    "linear-gradient(to right, rgba(239,231,220,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(239,231,220,0.1) 1px, transparent 1px)";

const Image = async () => {
    const { site, name, headline } = await getProfile();
    // "Nausher Rao: engineer, founder, stage manager" → "engineer, founder, stage manager."
    const roles = site.title.includes(":") ? site.title.slice(site.title.indexOf(":") + 1).trim() : site.title;
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 64,
                background: "#0c0b0d",
                backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,230,196,0.16), transparent 45%), ${grid}`,
                backgroundSize: "100% 100%, 200px 100%, 100% 157px",
                color: "#efe7dc",
            }}
        >
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "rgba(239,231,220,0.6)" }}>
                {new URL(site.url).host.toUpperCase()}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "Antique Olive",
                    fontSize: 168,
                    lineHeight: 0.82,
                    letterSpacing: -6,
                    color: "#ffe6c4",
                }}
            >
                {name.split(" ").map((word, i) => (
                    <span key={i}>{word}</span>
                ))}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: 30,
                    lineHeight: 1.25,
                    color: "rgba(239,231,220,0.85)",
                }}
            >
                <span>{roles.endsWith(".") ? roles : `${roles}.`}</span>
                <span style={{ color: "rgba(239,231,220,0.5)" }}>{headline.emphasis}</span>
            </div>
        </div>,
        { ...size, fonts: [{ name: "Antique Olive", data: display, style: "normal", weight: 900 }] },
    );
};

export default Image;
