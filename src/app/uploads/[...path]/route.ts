import { getLocal, localUploadsEnabled } from "@/lib/local-uploads";

/** Serves uploads kept in memory when Vercel Blob isn't configured (see lib/local-uploads). */
export const GET = async (_: Request, { params }: { params: Promise<{ path: string[] }> }) => {
    const file = localUploadsEnabled() ? getLocal((await params).path.join("/")) : undefined;
    if (!file) return new Response("Not found", { status: 404 });
    return new Response(file.bytes, { headers: { "Content-Type": file.type, "Cache-Control": "no-store" } });
};
