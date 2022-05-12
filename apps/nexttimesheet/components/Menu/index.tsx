import * as React from "react";

import { UserProfile } from "@auth0/nextjs-auth0";
import { Menu, Popover } from "@headlessui/react";
import {
    CalendarIcon,
    PencilAltIcon,
    UserGroupIcon,
} from "@heroicons/react/outline";

import Avatar from "../common/Avatar";
import Transition from "../common/CustTransition";
import ErrorBoundary from "../common/ErrorBoundary";

import NavButton from "./NavLinkButton";
import NavMenuButton from "./NavMenuButton";

/**
 * @name Sidebar
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Sidebar navigation menu.
 */
const TimesheetMenu = ({ user }: { user: UserProfile }) => {
    // const { userMetadata, user } = useProfile();

    return (
        <ErrorBoundary>
            <div className="w-full h-16  ">
                <div className=" max-w-screen-xl mx-auto h-full flex">
                    <Popover className={"z-50 relative"}>
                        {({ open }) => (
                            <>
                                <NavMenuButton open={open} />
                                <Transition open={open}>
                                    <Popover.Panel
                                        static
                                        className="origin-top-left absolute"
                                    >
                                        <div className=" flex flex-col mt-2 relative">
                                            <ul className="bg-base-300 menu rounded-box shadow-lg shadow-black/30 text-base flex flex-col p-2 ">
                                                <NavButton
                                                    icon={
                                                        <CalendarIcon className="h-6 w-6" />
                                                    }
                                                    title={"Timesheet"}
                                                    url={`/`}
                                                />
                                                <NavButton
                                                    icon={
                                                        <UserGroupIcon className="h-6 w-6" />
                                                    }
                                                    title={"Manage"}
                                                    url={`/manage`}
                                                />
                                            </ul>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>

                    <div className="flex-grow"></div>
                    <div className="">
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            {({ open }) => (
                                <>
                                    <div className="h-16  py-2">
                                        <Menu.Button className=" inline-flex justify-end h-full w-full  font-medium text-base-content btn btn-ghost  ">
                                            <div className="h-full mr-3 flex flex-col text-right">
                                                <div className="my-auto">
                                                    {user?.nickname}
                                                </div>
                                            </div>

                                            <div className="">
                                                <Avatar
                                                    name={user?.name}
                                                    image={user?.picture}
                                                />
                                            </div>
                                        </Menu.Button>
                                    </div>
                                    <Transition open={open}>
                                        <Menu.Items className="  absolute right-0   origin-top-right  ">
                                            <ul className="bg-base-300 menu rounded-box p-2 shadow-lg shadow-black/30 w-56 space-y-1">
                                                <Menu.Item as={"li"}>
                                                    {({ active }) => (
                                                        <button
                                                            className={`${
                                                                active
                                                                    ? "bg-primary text-white"
                                                                    : "text-base-content"
                                                            } group flex w-full items-center px-2 py-2 text-sm`}
                                                        >
                                                            <PencilAltIcon className="h-5 w-5 mr-2" />
                                                            Edit
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item as={"li"}>
                                                    {({ active }) => (
                                                        <button
                                                            className={`${
                                                                active
                                                                    ? "bg-primary text-white"
                                                                    : "text-base-content"
                                                            } group flex w-full items-center px-2 py-2 text-sm`}
                                                        >
                                                            <PencilAltIcon className="h-5 w-5 mr-2" />
                                                            Edit
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </ul>
                                        </Menu.Items>
                                    </Transition>
                                </>
                            )}
                        </Menu>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default TimesheetMenu;
