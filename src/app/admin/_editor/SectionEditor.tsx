"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { SectionKey } from "@/content/schema";
import { saveSection } from "../actions";
import type { Ctx, UploadMode } from "./context";
import { remapListErrors } from "./errors";
import { SECTIONS } from "./fields";
import { Fields } from "./FieldView";
import { clean, describe, fieldId, pathKey, setIn, type Value } from "./form-state";
import { useUnsavedGuard } from "./unsaved";

type SectionEditorProps = {
    section: SectionKey;
    initial: Value;
    /** Where the stored content fails its schema, if it does. Shown as errors until a save fixes them. */
    initialIssues?: { path: string; message: string }[];
    /** Nothing is stored for this section yet: the form starts empty and the first save creates it. */
    missing?: boolean;
    /** The stored version the form starts from (null if never saved). A save based on an older one is refused. */
    version: string | null;
    uploadMode: UploadMode;
    /** Why saving is off, if it is. */
    readOnly?: string;
};

/** The form for one content section. Saving sends the whole section; the server validates it against the schema. */
export const SectionEditor = ({
    section,
    initial,
    initialIssues = [],
    missing = false,
    version: initialVersion,
    uploadMode,
    readOnly,
}: SectionEditorProps) => {
    const { fields } = SECTIONS[section];
    const [value, setValue] = useState<Value>(initial);
    const [errors, setErrors] = useState<Record<string, string>>(() =>
        Object.fromEntries(initialIssues.map((i) => [i.path, i.message])),
    );
    const [summary, setSummary] = useState<{ message: string; items: { path: string; message: string }[] } | null>(
        initialIssues.length
            ? { message: "The saved content doesn't pass its checks. Fix these fields and save.", items: initialIssues }
            : null,
    );
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [announcement, setAnnouncement] = useState("");
    const pendingFocus = useRef<string | null>(null);
    /** Counts edits, so a save can tell whether the form changed while it was in progress. */
    const edits = useRef(0);
    /** The stored version this form's changes are based on: the one loaded, then each save's. */
    const version = useRef(initialVersion);
    // False in the server HTML, true once hydrated: until then Save is off, so it can't submit the form natively.
    const hydrated = useSyncExternalStore(
        noSubscribe,
        () => true,
        () => false,
    );
    const summaryRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!pendingFocus.current) return;
        document.getElementById(pendingFocus.current)?.focus();
        pendingFocus.current = null;
    });

    useUnsavedGuard(section, dirty, formRef);

    useEffect(() => {
        if (summary) summaryRef.current?.focus();
    }, [summary]);

    const ctx: Ctx = {
        value,
        errors,
        set: (path, v) => {
            setValue((old: Value) => setIn(old, path, v));
            edits.current += 1;
            setDirty(true);
            setStatus("");
        },
        remapErrors: (list, to) => {
            const remap = (items: { path: string; message: string }[]) => remapListErrors(items, pathKey(list), to);
            setErrors((old) => {
                const moved = remap(Object.entries(old).map(([path, message]) => ({ path, message })));
                return Object.fromEntries(moved.map((e) => [e.path, e.message]));
            });
            setSummary((old) => old && { ...old, items: remap(old.items) });
        },
        focusLater: (id) => (pendingFocus.current = id),
        announce: setAnnouncement,
        uploadMode,
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus("Saving…");
        const data = clean(fields, value);
        const editsAtSave = edits.current;
        try {
            const result = await saveSection(section, data, version.current);
            if (result.ok) {
                version.current = result.version;
                setErrors({});
                setSummary(null);
                if (edits.current === editsAtSave) {
                    setValue(data);
                    setDirty(false);
                    setStatus("Saved. It's live on the next page load.");
                } else {
                    // Keep what was typed while saving: it isn't in this save, so it's still unsaved.
                    setStatus("Saved, but you made changes while saving. Save again to keep them.");
                }
            } else {
                setErrors(Object.fromEntries(result.fieldErrors.map((f) => [f.path, f.message])));
                setSummary({ message: result.message, items: result.fieldErrors });
                setStatus("");
            }
        } catch {
            setStatus("");
            setSummary({ message: "The save didn't go through. Check your connection and try again.", items: [] });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form ref={formRef} className="editor" onSubmit={onSubmit} noValidate data-hydrated={hydrated || undefined}>
            {summary && (
                <div
                    className="error-summary"
                    role="alert"
                    tabIndex={-1}
                    ref={summaryRef}
                    aria-labelledby="error-summary-title"
                >
                    <h2 id="error-summary-title">{summary.message}</h2>
                    {summary.items.length > 0 && (
                        <ul>
                            {summary.items.map((item) => {
                                const where = describe(fields, value, item.path ? item.path.split(".") : []);
                                return (
                                    <li key={item.path + item.message}>
                                        {item.path ? (
                                            <a href={`#${fieldId(item.path.split("."))}`}>
                                                {where}: {item.message}
                                            </a>
                                        ) : (
                                            <span>
                                                {where ? `${where}: ` : ""}
                                                {item.message}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}

            {readOnly && <p className="notice">{readOnly}</p>}
            {missing && (
                <p className="notice">Nothing is saved for this section yet. Fill it in and save to create it.</p>
            )}

            <Fields fields={fields} path={[]} ctx={ctx} />

            <div className="savebar">
                <button type="submit" className="primary" disabled={saving || !hydrated || Boolean(readOnly)}>
                    {saving ? "Saving…" : "Save"}
                </button>
                <p role="status" className="status">
                    {status || (dirty ? "Unsaved changes." : "")}
                </p>
            </div>
            <p className="sr-only" aria-live="polite">
                {announcement}
            </p>
        </form>
    );
};

const noSubscribe = () => () => {};
