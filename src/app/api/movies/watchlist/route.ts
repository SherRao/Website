/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextRequest } from "next/server";
import { XMLParser } from "fast-xml-parser";

export type Movie = {
    title: string;
    score: string;
};

export async function GET(request: NextRequest) {
    const url = request.nextUrl;

    return Response.json("Not Supported ATM");
};