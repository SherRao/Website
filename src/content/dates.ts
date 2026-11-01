/**
 * Date text for jobs, made from the stored months ("2022-05") so it can never drift from them. A stint with no end
 * is ongoing ("now").
 */

import type { Stint } from "./types";

/** Month names as the site writes them, January first. */
export const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** A "YYYY-MM" month, with the month from 01 to 12. */
export const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

const year = (month: string) => month.slice(0, 4);

const monthName = (month: string) => MONTHS[Number(month.slice(5, 7)) - 1];

/** "2022-05" as "may 2022". */
export const monthLabel = (month: string) => `${monthName(month)} ${year(month)}`;

/** One stint as "may 2022 to aug 2022", or "mar 2026 to now". */
export const stintLabel = ({ start, end }: Pick<Stint, "start" | "end">) =>
    `${monthLabel(start)} to ${end ? monthLabel(end) : "now"}`;

/** The years a job spans, across all its stints: "2022 to 2023", "2024 to now", or "2024" for one year. */
export const yearRange = (stints: Stint[]) => {
    const first = year(stints.map((s) => s.start).sort()[0]);
    if (stints.some((s) => !s.end)) return `${first} to now`;
    const last = year(
        stints
            .map((s) => s.end!)
            .sort()
            .at(-1)!,
    );
    return first === last ? first : `${first} to ${last}`;
};

/** A job's stints in the order they started, leaving the list as it is. */
export const stintsInOrder = <T extends Stint>(stints: T[]) =>
    [...stints].sort((a, b) => a.start.localeCompare(b.start));

/** The stint that started last, for the role shown next to a job. */
export const latestStint = <T extends Stint>(stints: T[]) => stintsInOrder(stints).at(-1)!;

/** One stint, short: "may to aug 2022" within a year, otherwise "aug 2011 to jul 2022" or "jul 2024 to now". */
export const stintShort = ({ start, end }: Stint) =>
    end && year(start) === year(end) ? `${monthName(start)} to ${monthLabel(end)}` : stintLabel({ start, end });
