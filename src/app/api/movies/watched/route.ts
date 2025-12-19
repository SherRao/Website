import type { NextRequest } from "next/server";
import { XMLParser } from "fast-xml-parser";

export type Movie = {
    title: string;
    score: number;
};

/**
 * 
 * Returns a list of all movies I've watched.
 * 
 * @param request None
 * @returns A list of all movies I've watched, sorted by score descending.
 */
export async function GET(request: NextRequest) {
    const url = request.nextUrl;

    const parser = new XMLParser();
    const letterboxdDataResponse = await fetch("https://letterboxd.com/SherRao/rss/");
    const letterboxdData = await letterboxdDataResponse.text();

    const parsedData = parser.parse(letterboxdData);
    const movieData = parsedData.rss.channel.item;

    const result: Movie[] = [];
    for (const item of movieData) {
        const rawTitle = item.title;
        const lastCommaIndex = rawTitle.lastIndexOf(",");
        const lastDashIndex = rawTitle.lastIndexOf("-");

        const title = rawTitle.slice(0, lastCommaIndex);
        const score = rawTitle.slice(lastDashIndex + 2);
        result.push({ title: title, score: convertStringScoreToNumber(score) });
    }

    result.sort((a, b) => b.score - a.score);
    return Response.json(result);
};

/**
 * 
 * Takes a Letterboxd score string and converts it into a number. 
 * 
 * @param scoreStr The input string
 * @returns The final score
 */
const convertStringScoreToNumber = (scoreStr: string) => {
    let stars = 0;
    for (const char of scoreStr)
        if (char === "★") stars += 1;

    if (scoreStr.includes("½"))
        stars += 0.5;

    return stars;
};