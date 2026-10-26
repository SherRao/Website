/**
 * Date text for jobs, made from the stored months ("2022-05") so it can never drift from them. A stint with no end
 * is ongoing ("now").
 */

export type Stint = { role: string; start: string; end?: string };

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** A "YYYY-MM" month, with the month from 01 to 12. */
export const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

const year = (month: string) => month.slice(0, 4);

/** "2022-05" as "may 2022". */
export const monthLabel = (month: string) => `${MONTHS[Number(month.slice(5, 7)) - 1]} ${year(month)}`;

/** One stint as "may 2022 to aug 2022", or "mar 2026 to now". */
export const stintLabel = ({ start, end }: Stint) => `${monthLabel(start)} to ${end ? monthLabel(end) : "now"}`;

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

/** The stint that started last, for the role shown next to a job. */
export const latestStint = <T extends Stint>(stints: T[]) =>
    [...stints].sort((a, b) => a.start.localeCompare(b.start)).at(-1)!;

/** One stint, short: "may to aug 2022" within a year, otherwise "aug 2011 to jul 2022" or "jul 2024 to now". */
export const stintShort = ({ start, end }: Stint) =>
    end && year(start) === year(end)
        ? `${MONTHS[Number(start.slice(5, 7)) - 1]} to ${monthLabel(end)}`
        : stintLabel({ role: "", start, end });
