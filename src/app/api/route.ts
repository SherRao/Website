import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const url = request.nextUrl;

    return Response.json({ message: `Hello World. Your url is: ${url.href}` })

}