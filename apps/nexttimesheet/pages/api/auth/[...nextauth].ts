import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
    providers: [
        // Auth0Provider({
        //     clientId: String(process.env.AUTH0_CLIENT_ID),
        //     clientSecret: String(process.env.AUTH0_CLIENT_SECRET),
        //     issuer: process.env.AUTH0_ISSUER_BASE_URL,
        //     authorization: { params: { scope: "openid email profile" } },
        //     profile(profile, tokens) {
        //         return {
        //             id: profile.sub,
        //             name: profile.nickname,
        //             email: profile.email,
        //             image: profile.picture,
        //             fullname: profile.name,
        //         };
        //     },
        // }),
        TwitterProvider({
            clientId: String(process.env.TWITTER_CLIENT_ID),
            clientSecret: String(process.env.TWITTER_CLIENT_SECRET),
            version: "2.0",
        }),
        DiscordProvider({
            clientId: String(process.env.DISCORD_CLIENT_ID),
            clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        // signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    debug: true,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.fullname = user.fullname;
            }
            return token;
        },
        async session({ session, token }) {
            // Store the user's profile in the session
            session.user.name = token.fullname;
            session.user.nickname = token.name;
            session.user.sub = token.sub;
            return session;
        },
    },
});
