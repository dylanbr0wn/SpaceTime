import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import * as React from "react";

import DashBoard from "../components/Dashboard";
import Footer from "../components/Footer";
import Timesheet from "../components/Timesheet";

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

    return {
        props: {
            // userData: userData?.userFromAuthId,
            session,
        },
    };
};

const Home: NextPage = () => {
    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <DashBoard>
                    <div className="h-full w-full m-0 p-0">
                        <Timesheet />
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
