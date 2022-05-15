/* eslint-disable no-unused-vars */
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            fullname: string;
        } & DefaultSession["user"];
    }

    interface Profile {
        fullname: string;
    }
    interface User {
        fullname: string;
    }

    interface JWT {
        fullname: string;
    }
}
