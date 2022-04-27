import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useDebounce } from "@react-hook/debounce";

import { GetUserFromAuth0Query } from "../api";
import SplashWaves from "../waves/SplashWaves";

export enum RegisterTab {
    Join,
    Create,
}

const Register = ({
    timesheetUserData,
    loadingTimesheetUser,
}: {
    timesheetUserData: GetUserFromAuth0Query | undefined;
    loadingTimesheetUser: boolean;
}) => {
    const [tab, setTab] = React.useState<RegisterTab>(RegisterTab.Join);
    const [showRegister, setShowRegister] = useDebounce(false, 500);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (timesheetUserData?.getUserFromAuth0?.id) {
            navigate(`/time/${timesheetUserData?.getUserFromAuth0?.id}`, {
                replace: true,
            });
        }
    }, [timesheetUserData, navigate]);

    React.useEffect(() => {
        if (!loadingTimesheetUser && !timesheetUserData?.getUserFromAuth0?.id) {
            setShowRegister(true);
        } else {
            setShowRegister(false);
        }
    }, [loadingTimesheetUser, setShowRegister, timesheetUserData]);

    return (
        <div className="w-full h-full bg-slate-900">
            {showRegister && (
                <>
                    <SplashWaves />
                    <div className="flex flex-col h-full w-full absolute top-0 left-0">
                        <div className="flex flex-col max-w-5xl p-5 m-auto bg-slate-800 rounded shadow-lg">
                            <div className="text-center text-sky-300 text-2xl my-6">
                                Register
                            </div>
                            <div className="border-b border-gray-200 dark:border-gray-700 w-fit m-auto">
                                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                    <li className="mr-2">
                                        <div
                                            aria-current={
                                                tab === RegisterTab.Join
                                            }
                                            onClick={() => {
                                                setTab(RegisterTab.Join);
                                                navigate("join");
                                            }}
                                            className={`inline-flex p-4 rounded-t-lg border-b-2 cursor-pointer transition-all group ${
                                                tab === RegisterTab.Join
                                                    ? "text-sky-600 border-sky-600 active dark:text-sky-500 dark:border-sky-500"
                                                    : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-transparent "
                                            }`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`mr-2 w-5 h-5 ${
                                                    tab === RegisterTab.Join
                                                        ? "text-sky-600 dark:text-sky-500"
                                                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                                } `}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                            </svg>
                                            Join
                                        </div>
                                    </li>
                                    <li className="mr-2">
                                        <div
                                            aria-current={
                                                tab === RegisterTab.Create
                                            }
                                            onClick={() => {
                                                setTab(RegisterTab.Create);
                                                navigate("create");
                                            }}
                                            className={`inline-flex p-4 cursor-pointer transition-all ${
                                                tab === RegisterTab.Create
                                                    ? "text-sky-600 border-sky-600 active dark:text-sky-500 dark:border-sky-500"
                                                    : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-transparent "
                                            } rounded-t-lg border-b-2   group`}
                                        >
                                            <svg
                                                className={`mr-2 w-5 h-5 ${
                                                    tab === RegisterTab.Create
                                                        ? "text-sky-600 dark:text-sky-500"
                                                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300 "
                                                }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Create
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <Outlet />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Register;
