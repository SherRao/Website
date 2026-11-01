import type { Path, Value } from "./form-state";

export type UploadMode = "blob" | "local" | "off";

export type Ctx = {
    value: Value;
    errors: Record<string, string>;
    set: (path: Path, v: Value) => void;
    /** Moves the errors under a list with its items after a move or remove (see remapListErrors). */
    remapErrors: (list: Path, to: (index: number) => number | undefined) => void;
    focusLater: (id: string) => void;
    announce: (msg: string) => void;
    uploadMode: UploadMode;
};
