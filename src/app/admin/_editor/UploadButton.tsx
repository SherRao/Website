import { upload } from "@vercel/blob/client";
import { useEffect, useId, useRef, useState } from "react";
import { UPLOADS, uploadPathname, uploadProblem, type UploadKind } from "@/lib/upload-rules";
import type { Ctx } from "./context";
import { getIn, type Path } from "./form-state";

const toSafePreviewSrc = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    // Disallow control characters to avoid parser ambiguities.
    if (/[\u0000-\u001F\u007F]/.test(trimmed)) return "";

    // Allow only root-relative paths (not protocol-relative //...).
    if (trimmed.startsWith("/")) {
        if (trimmed.startsWith("//")) return "";
        return trimmed;
    }

    try {
        const u = new URL(trimmed);
        if (u.protocol !== "http:" && u.protocol !== "https:") return "";
        // Do not allow embedded credentials in preview URLs.
        if (u.username || u.password) return "";
        return u.toString();
    } catch {
        return "";
    }
};

export const UploadButton = ({ kind, path, ctx, label }: { kind: UploadKind; path: Path; ctx: Ctx; label: string }) => {
    const inputId = useId();
    const [state, setState] = useState<{ busy: boolean; message: string; error: boolean }>({
        busy: false,
        message: "",
        error: false,
    });
    // An upload can finish after its item moved or was removed: write to where the item is now, or nowhere.
    const latestPath = useRef(path);
    const mounted = useRef(false);
    useEffect(() => {
        latestPath.current = path;
    });
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    const current = String(getIn(ctx.value, path) ?? "");
    const safePreviewSrc = toSafePreviewSrc(current);
    const verb = kind === "resume" ? "Upload a PDF" : "Upload a photo";

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        const problem = uploadProblem(kind, file);
        if (problem) return setState({ busy: false, message: `Not uploaded: ${problem}`, error: true });
        setState({ busy: true, message: "Uploading…", error: false });
        try {
            let url: string;
            if (ctx.uploadMode === "blob") {
                const blob = await upload(uploadPathname(kind, file.type), file, {
                    access: "public",
                    handleUploadUrl: "/admin/upload",
                    clientPayload: kind,
                    contentType: file.type,
                });
                url = blob.url;
            } else {
                const form = new FormData();
                form.set("kind", kind);
                form.set("file", file);
                const res = await fetch("/admin/upload", { method: "POST", body: form });
                const body = (await res.json()) as { url?: string; error?: string };
                if (!res.ok || !body.url) throw new Error(body.error ?? "Upload failed");
                url = body.url;
            }
            if (!mounted.current) return;
            ctx.set(latestPath.current, url);
            setState({ busy: false, message: "Uploaded. Save to publish it.", error: false });
        } catch (error) {
            setState({ busy: false, message: `Not uploaded: ${(error as Error).message}`, error: true });
        }
    };

    if (ctx.uploadMode === "off") {
        return (
            <p className="hint">
                Uploads need file storage (BLOB_READ_WRITE_TOKEN). You can still enter a /path or a Blob URL.
            </p>
        );
    }
    return (
        <div className="upload">
            {kind === "photo" && safePreviewSrc && (
                // Previews may come from any host the owner pastes, so this skips next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={safePreviewSrc} alt="" className="preview" width={96} height={64} />
            )}
            <label htmlFor={inputId} className="button">
                {state.busy ? "Uploading…" : verb}
                <span className="sr-only"> for {label}</span>
            </label>
            <input
                id={inputId}
                type="file"
                className="file-input"
                accept={UPLOADS[kind].accept}
                disabled={state.busy}
                onChange={onFile}
            />
            <p className={state.error ? "field-error" : "hint"} role={state.error ? "alert" : "status"}>
                {state.message}
            </p>
        </div>
    );
};
