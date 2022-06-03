import type { GetServerSidePropsContext, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import * as React from "react";

import DashBoard from "../components/Dashboard";
import EmployeeTimesheet from "../components/EmployeeTimesheet";
import Footer from "../components/Footer";
import {
    initializeApollo,
    UserFromAuthIdDocument,
    UserFromAuthIdQuery,
    UserFromAuthIdQueryVariables,
} from "../lib/apollo";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);
    if (!session) {
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false,
            },
        };
    }
    const user = session?.user;
    const client = initializeApollo({ headers: ctx?.req?.headers });

    const { data: userData } = await client.query<
        UserFromAuthIdQuery,
        UserFromAuthIdQueryVariables
    >({
        query: UserFromAuthIdDocument,
        variables: {
            authId: String(user?.sub),
        },
        errorPolicy: "all",
    });
    if (!userData?.userFromAuthId) {
        return {
            redirect: {
                destination: "/auth/register",
                permanent: false,
            },
        };
    }

    return {
        props: {
            userData: userData?.userFromAuthId,
            user,
        },
    };
};

const Home: NextPage<{
    userData: UserFromAuthIdQuery["userFromAuthId"];
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
                <Footer />
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

export default Home;
