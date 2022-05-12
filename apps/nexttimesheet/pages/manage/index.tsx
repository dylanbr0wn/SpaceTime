import { GetServerSidePropsContext, NextPage } from "next";

import {
    getSession,
    UserProfile,
    withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { ChartSquareBarIcon } from "@heroicons/react/outline";

import EmployeeForm from "../../components/admin/EmployeeForm";
import TokenList from "../../components/admin/TokenList";
import DashBoard from "../../components/Dashboard";
import {
    client,
    GetUserFromAuth0Document,
    GetUserFromAuth0Query,
    GetUserFromAuth0QueryVariables,
    User,
} from "../../lib/apollo";

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

const Manage: NextPage<{
    userData: Partial<User>;
    user: UserProfile;
}> = ({ userData, user }) => {
    return (
        <DashBoard user={user}>
            <div
                className="h-full w-full flex flex-col"
                style={{ margin: 0, padding: 0 }}
            >
                <div className="flex max-w-screen-xl mx-auto space-x-12">
                    <div className="w-72 card bg-base-200 flex flex-col p-3 ">
                        <EmployeeForm currentUser={userData} />
                    </div>
                    <div className="card w-72  bg-base-200 p-3">
                        <div className="flex  content-middle">
                            <ChartSquareBarIcon className="w-7 h-7 mx-2 my-1 text-secondary" />
                            <div className="text-secondary text-xl w-full my-auto">
                                Stats
                            </div>
                        </div>
                        <div className="text-base-content px-3 mt-2">
                            <span className="text-xl font-bold text-secondary mr-2">
                                10
                            </span>
                            reporting to you
                        </div>
                        <div className="text-base-content px-3 mt-2">
                            <span className="text-xl font-bold text-accent mr-2">
                                6
                            </span>
                            have submitted a timesheet
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full p-3">
                    <div className=" p-3">
                        <TokenList currentUser={userData} />
                    </div>
                </div>
            </div>
        </DashBoard>
    );
};

export default Manage;
