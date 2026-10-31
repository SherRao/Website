/** Revisions shown per page of history. */
export const PER_PAGE = 20;

/** The furthest page whose offset is still a safe integer. Beyond any real history, it shows "No versions". */
const LAST_PAGE = Math.floor(Number.MAX_SAFE_INTEGER / PER_PAGE);

/** The page asked for in `?page`: a whole number from 1 to LAST_PAGE, or 1 if it isn't a number. */
export const pageNumber = (param: string | undefined) => {
    const n = Math.floor(Number(param));
    return Number.isNaN(n) ? 1 : Math.min(Math.max(1, n), LAST_PAGE);
};
