/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.nextUrl;

    return Response.json("Not Supported ATM");
};