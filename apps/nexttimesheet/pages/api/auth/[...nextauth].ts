import NextAuth from "next-auth/next";
import Auth0Provider from "next-auth/providers/auth0";

export default NextAuth({
    providers: [
        Auth0Provider({
            clientId: String(process.env.AUTH0_CLIENT_ID),
            clientSecret: String(process.env.AUTH0_CLIENT_SECRET),
            issuer: process.env.AUTH0_ISSUER_BASE_URL,
            authorization: { params: { scope: "openid email profile" } },
            profile(profile, tokens) {
                return {
                    id: profile.sub,
                    name: profile.nickname,
                    email: profile.email,
                    image: profile.picture,
                    fullname: profile.name,
                };
            },
        }),
    ],
    debug: true,
    secret: String(process.env.AUTH0_SECRET),
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
