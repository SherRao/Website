/** True only for the one GitHub account allowed into the admin panel. With ADMIN_GITHUB_ID unset, nobody is. */
export const isOwnerGithubId = (id: unknown): boolean => {
    const owner = process.env.ADMIN_GITHUB_ID?.trim();
    return Boolean(owner) && id != null && String(id) === owner;
};

export class NotOwnerError extends Error {
    constructor() {
        super("Sign in as the site owner to do this");
    }
}

type SessionLike = { user?: { githubId?: string } | null } | null;

/** Throws NotOwnerError unless the session belongs to the owner. */
export const assertOwner = <S extends SessionLike>(session: S): NonNullable<S> => {
    if (!session || !isOwnerGithubId(session.user?.githubId)) throw new NotOwnerError();
    return session as NonNullable<S>;
};
