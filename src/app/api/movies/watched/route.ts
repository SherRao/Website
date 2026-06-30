import { XMLParser } from "fast-xml-parser";
import type { Movie } from "@/data/types";

/**
 * Returns a list of all movies I've watched on Letterboxd, sorted by score desc.
 */
export async function GET() {
    try {
        const parser = new XMLParser();
        const letterboxdDataResponse = await fetch("https://letterboxd.com/SherRao/rss/", {
            next: { revalidate: 3600 },
        });
        const letterboxdData = await letterboxdDataResponse.text();

        const parsedData = parser.parse(letterboxdData);
        const movieData = parsedData.rss?.channel?.item ?? [];

        const result: Movie[] = [];
        for (const item of movieData) {
            const rawTitle = item.title;
            const lastCommaIndex = rawTitle.lastIndexOf(",");
            const lastDashIndex = rawTitle.lastIndexOf("-");

            const title = rawTitle.slice(0, lastCommaIndex);
            const score = rawTitle.slice(lastDashIndex + 2);
            result.push({ title, score: convertStringScoreToNumber(score) });
        }

        result.sort((a, b) => b.score - a.score);
        return Response.json(result);
    } catch {
        return Response.json([]);
    }
}

const convertStringScoreToNumber = (scoreStr: string) => {
    let stars = 0;
    for (const char of scoreStr)
        if (char === "★") stars += 1;

    if (scoreStr.includes("½"))
        stars += 0.5;

    return stars;
};
