import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { isOwnerGithubId } from "@/lib/owner";

declare module "next-auth" {
    interface Session {
        user: { githubId?: string } & DefaultSession["user"];
    }
}

/**
 * Admin sign-in: GitHub only, and only the account whose numeric id is ADMIN_GITHUB_ID (the id survives a username
 * change). Sessions are JWT cookies, so there's no session table.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [GitHub],
    // A week, not Auth.js's 30 days: signing in again is one click, and a leaked cookie stops working sooner.
    session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
    callbacks: {
        // Any other account is turned away here, before a session exists.
        signIn: ({ account, profile }) => account?.provider === "github" && isOwnerGithubId(profile?.id),
        jwt: ({ token, account, profile }) => {
            if (account?.provider === "github" && profile?.id != null) token.githubId = String(profile.id);
            return token;
        },
        session: ({ session, token }) => {
            session.user.githubId = typeof token.githubId === "string" ? token.githubId : undefined;
            return session;
        },
    },
});
