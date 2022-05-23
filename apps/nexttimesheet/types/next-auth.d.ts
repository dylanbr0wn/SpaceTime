/* eslint-disable no-unused-vars */
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            sub: string;
        } & DefaultSession["user"];
    }

    // interface Profile {
    //     fullname: string;
    // }
    // interface User {
    //     fullname: string;
    // }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        sub: string;
    }
}
