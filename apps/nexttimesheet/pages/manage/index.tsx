import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ChartSquareBarIcon, UserAddIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { GetServerSidePropsContext, NextPage } from "next";
import EmployeeForm from "../../components/admin/EmployeeForm";
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

const Manage: NextPage<{ userData: Partial<User> }> = ({ userData }) => {
    return (
        <div
            className="h-full w-full flex flex-col"
            style={{ margin: 0, padding: 0 }}
        >
            <div className="flex">
                <div className="w-full m-3 flex flex-col bg-slate-800 rounded p-3 border border-slate-700">
                    <div className="flex  content-middle">
                        <UserAddIcon className="w-7 h-7 mx-2 my-1 text-teal-500" />
                        <div className="text-teal-300 text-xl w-full my-auto">
                            Invite
                        </div>
                    </div>
                    <div className="text-sky-200 p-2">
                        Add a user to your tenant so you can start using
                        SpaceTime together!
                    </div>
                    <div>
                        <button className="border-2 flex border-teal-500 shadow-transparent shadow-lg hover:shadow-cyan-500/20 text-teal-300 transition-all hover:text-white  hover:bg-teal-500 rounded-md p-2 mx-auto group ">
                            <PlusIcon className="h-6 w-6 mr-2" />

                            <div className="text-sm font-bold my-auto">
                                Invite
                            </div>
                        </button>
                    </div>
                </div>
                <div className="w-full m-3 flex flex-col bg-slate-800 rounded p-3 border border-slate-700">
                    <div className="flex  content-middle">
                        <ChartSquareBarIcon className="w-7 h-7 mx-2 my-1 text-purple-400" />
                        <div className="text-purple-400 text-xl w-full my-auto">
                            Stats
                        </div>
                    </div>
                    <div className="text-purple-200 px-3 mt-2">
                        <span className="text-xl font-bold text-purple-400 mr-2">
                            10
                        </span>
                        reporting to you
                    </div>
                    <div className="text-purple-200 px-3 mt-2">
                        <span className="text-xl font-bold text-teal-400 mr-2">
                            6
                        </span>
                        have submitted a timesheet
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full px-3">
                <div className="rounded bg-slate-800 border border-slate-700">
                    <EmployeeForm currentUser={userData} />
                </div>
            </div>
        </div>
    );
};

export default Manage;
