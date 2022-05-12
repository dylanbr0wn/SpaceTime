import type { GetServerSidePropsContext, NextPage } from "next";
import * as React from "react";

import {
    getSession,
    UserProfile,
    withPageAuthRequired,
} from "@auth0/nextjs-auth0";

import DashBoard from "../components/Dashboard";
import EmployeeTimesheet from "../components/EmployeeTimesheet";
import {
    client,
    GetUserFromAuth0Document,
    GetUserFromAuth0Query,
    GetUserFromAuth0QueryVariables,
    User,
} from "../lib/apollo";

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: async (ctx: GetServerSidePropsContext) => {
        const session = getSession(ctx.req, ctx.res);

        const user = session?.user;

        const { data: userData } = await client.query<
            GetUserFromAuth0Query,
            GetUserFromAuth0QueryVariables
        >({
            query: GetUserFromAuth0Document,
            variables: {
                auth0Id: String(user?.sub),
            },
        });

        return {
            props: {
                userData: userData?.getUserFromAuth0,
            },
        };
    },
});

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//     const session = getSession(ctx.req, ctx.res);

//     const user = session?.user;

//     const { data: userData } = await client.query<
//         GetUserFromAuth0Query,
//         GetUserFromAuth0QueryVariables
//     >({
//         query: GetUserFromAuth0Document,
//         variables: {
//             auth0Id: String(user?.sub),
//         },
//     });

//     return {
//         props: {
//             userData: userData?.getUserFromAuth0,
//             page: "Home",
//         },
//     };
// };

const Home: NextPage<{
    userData: Partial<User>;
    user: UserProfile;
}> = ({ userData, user }) => {
    return (
        <DashBoard user={user}>
            <div className="h-full w-full m-0 p-0">
                <EmployeeTimesheet userData={userData} user={user} />
            </div>
        </DashBoard>
    );
};

export default Home;
