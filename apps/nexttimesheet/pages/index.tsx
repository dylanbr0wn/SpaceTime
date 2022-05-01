import { getSession, useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import EmployeeTimesheet from "../components/EmployeeTimesheet";
import { client, GetUserFromAuth0Document, User } from "../lib/apollo";
import styles from "../styles/Home.module.css";

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: async (ctx: GetServerSidePropsContext) => {
        const session = getSession(ctx.req, ctx.res);

        const user = session?.user;

        const { data: userData } = await client.query({
            query: GetUserFromAuth0Document,
            variables: {
                auth0Id: String(user?.sub),
            },
        });

        return {
            props: {
                userData,
            },
        };
    },
});

const Home: NextPage<{ userData: Partial<User> }> = ({ userData }) => {
    return (
        <div className="h-full w-full " style={{ margin: 0, padding: 0 }}>
            <EmployeeTimesheet user={userData} />
        </div>
    );
};

export default Home;
