import type { GetServerSidePropsContext, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import * as React from "react";

import DashBoard from "../components/Dashboard";
import EmployeeTimesheet from "../components/EmployeeTimesheet";
import {
    client,
    GetUserFromAuth0Document,
    GetUserFromAuth0Query,
    GetUserFromAuth0QueryVariables,
    initializeApollo,
    User,
} from "../lib/apollo";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const client = initializeApollo({ headers: ctx?.req?.headers });
    const session = await getSession(ctx);

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
};

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
    user: Session["user"];
}> = ({ userData, user }) => {
    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <DashBoard user={user}>
                    <div className="h-full w-full m-0 p-0">
                        <EmployeeTimesheet userData={userData} user={user} />
                    </div>
                </DashBoard>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
                <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
                    <li>
                        <a>Sidebar Item 1</a>
                    </li>
                    <li>
                        <a>Sidebar Item 2</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

Home.auth = true;

export default Home;
