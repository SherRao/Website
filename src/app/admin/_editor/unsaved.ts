import { useEffect, type RefObject } from "react";

const MESSAGE = "You have unsaved changes. Leave this page without saving them?";

/** Sections with unsaved changes. Outside React, because a hidden section's form still holds its changes. */
const unsaved = new Set<string>();

const warnOnUnload = (e: BeforeUnloadEvent) => {
    if (unsaved.size) e.preventDefault();
};

/** The link or button a click leaves the form through, if it does: not one in the form, a new tab or a same-page anchor. */
const exitFrom = (e: MouseEvent, form: HTMLFormElement | null) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
    const exit = (e.target as Element).closest<HTMLAnchorElement | HTMLButtonElement>("a[href], button");
    if (!exit || form?.contains(exit)) return null;
    if (exit instanceof HTMLAnchorElement) {
        if (exit.target === "_blank" || exit.hasAttribute("download")) return null;
        if (exit.hash && exit.pathname === location.pathname && exit.search === location.search) return null;
    }
    return exit;
};

/**
 * Warns before unsaved changes in a section's form are lost. Next.js hides a page on navigation rather than
 * unmounting it, which runs its effects' cleanups, and drops it for good a few routes later. So a `beforeunload`
 * listener that lives in an effect would stop guarding the changes as soon as the visitor navigates away.
 * - Links and buttons out of the form ask first, because a dropped page gives no other chance to warn.
 * - Closing or reloading the tab warns even while the form is hidden, as after the browser's back button.
 * Going ahead through a link gives the changes up, so only the form coming back into view guards them again.
 */
export const useUnsavedGuard = (section: string, dirty: boolean, form: RefObject<HTMLFormElement | null>) => {
    useEffect(() => {
        if (dirty) unsaved.add(section);
        else unsaved.delete(section);
        window.addEventListener("beforeunload", warnOnUnload);
    }, [section, dirty]);

    useEffect(() => {
        if (!dirty) return;
        const onClick = (e: MouseEvent) => {
            if (!exitFrom(e, form.current)) return;
            if (window.confirm(MESSAGE)) {
                unsaved.delete(section);
                return;
            }
            e.preventDefault();
            e.stopPropagation();
        };
        // On window, in the capture phase, so a refusal stops the click before next/link or a form's action sees it.
        window.addEventListener("click", onClick, true);
        return () => window.removeEventListener("click", onClick, true);
    }, [section, dirty, form]);
};
