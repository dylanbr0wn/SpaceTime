import * as React from "react";

import { Menu, Popover, Transition } from "@headlessui/react";

import {
    client,
    GetUserFromAuth0Document,
    useGetUserFromAuth0Query,
} from "../../lib/apollo";
import ErrorBoundary from "../common/ErrorBoundary";
import NavMenuButton from "./NavMenuButton";
import NavLinkList from "./NavLinkList";
import { PencilAltIcon } from "@heroicons/react/outline";
import { getSession, useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSidePropsContext } from "next";

/**
 * @name Sidebar
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Sidebar navigation menu.
 */
const TimesheetMenu = () => {
    // const { userMetadata, user } = useProfile();
    const { user } = useUser();

    return (
        <ErrorBoundary>
            <div className="w-full h-16  ">
                <div className=" max-w-screen-2xl mx-auto h-full flex">
                    <Popover style={{ zIndex: 500 }}>
                        {({ open }) => (
                            <>
                                <NavMenuButton open={open} />
                                <NavLinkList />
                            </>
                        )}
                    </Popover>

                    <div className="flex-grow"></div>
                    <div className="">
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div className="h-16  py-2">
                                <Menu.Button className=" inline-flex justify-end h-full w-full  font-medium text-slate-200 group  transition-all  ">
                                    <div className="h-full mx-3 flex flex-col text-right">
                                        <div className="my-auto">
                                            {user?.nickname}
                                        </div>
                                    </div>
                                    {/* <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 h-9 w-9 m-auto p-1 rounded-full bg-teal-500 transform scale-100 group-hover:scale-125 transition-transform"></div>
                                        <img
                                            className="absolute inset-0 h-9 w-9 m-auto rounded-full scale-100"
                                            src={user?.picture ?? ""}
                                            alt={user?.name ?? ""}
                                        />
                                    </div> */}
                                    <img
                                        className="  h-9 w-9 my-auto mr-2 rounded-full scale-100 "
                                        src={user?.picture ?? ""}
                                        alt={user?.name ?? ""}
                                    />
                                </Menu.Button>
                            </div>
                            <Transition
                                as={React.Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="focus:outline-none absolute right-0  w-56 origin-top-right divide-y divide-slate-700 border border-slate-700 rounded-md bg-slate-800 shadow-lg shadow-black/30 ring-1 ring-black ring-opacity-5">
                                    <div className="px-1 py-1 ">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active
                                                            ? "bg-violet-500 text-white"
                                                            : "text-slate-400"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    <PencilAltIcon className="h-5 w-5 mr-2" />
                                                    Edit
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active
                                                            ? "bg-violet-500 text-white"
                                                            : "text-slate-400"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    <PencilAltIcon className="h-5 w-5 mr-2" />
                                                    Edit
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active
                                                            ? "bg-violet-500 text-white"
                                                            : "text-slate-400"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    <PencilAltIcon className="h-5 w-5 mr-2" />
                                                    Edit
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active
                                                            ? "bg-violet-500 text-white"
                                                            : "text-slate-400"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    <PencilAltIcon className="h-5 w-5 mr-2" />
                                                    Edit
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active
                                                            ? "bg-violet-500 text-white"
                                                            : "text-slate-400"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    <PencilAltIcon className="h-5 w-5 mr-2" />
                                                    Edit
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default TimesheetMenu;
