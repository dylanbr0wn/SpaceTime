import Link from "next/link";
import { Session } from "next-auth";
import * as React from "react";

import { FeedbackFish } from "@feedback-fish/react";
import { Menu, Popover } from "@headlessui/react";
import {
    CalendarIcon,
    PencilAltIcon,
    SupportIcon,
    UserGroupIcon,
} from "@heroicons/react/outline";

import { User } from "../../lib/apollo";
import Avatar from "../common/Avatar";
import Transition from "../common/CustTransition";
import ErrorBoundary from "../common/ErrorBoundary";

import NavMenuButton from "./NavMenuButton";

/**
 * @name Sidebar
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Sidebar navigation menu.
 */
const TimesheetMenu = ({ user }: { user: Session["user"] }) => {
    // const { userMetadata, user } = useProfile();

    const [menu] = React.useState([
        {
            icon: <CalendarIcon className="h-6 w-6" />,
            title: "Timesheet",
            href: "/",
        },
        {
            icon: <UserGroupIcon className="h-6 w-6" />,
            title: "Manage",
            href: "/manage",
        },
    ]);

    return (
        <ErrorBoundary>
            <div className="w-full h-16  z-50">
                <div className=" max-w-screen-xl mx-auto h-full flex">
                    <Menu as={"div"} className={"relative inline-block  z-50"}>
                        {({ open }) => (
                            <>
                                <NavMenuButton open={open} />
                                <Transition open={open}>
                                    <Menu.Items
                                        static
                                        className="origin-top-left absolute left-0"
                                    >
                                        <ul className="bg-base-300 menu rounded-box shadow-lg shadow-black/30 text-base w-64 p-2 space-y-1">
                                            {menu.map((item, index) => (
                                                <Menu.Item
                                                    key={index}
                                                    as={"li"}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        title={item.title}
                                                    >
                                                        <a className="">
                                                            {item.icon}
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {item.title}
                                                                </p>
                                                                <p className="text-sm text-base-content group-hover:text-white transition-colors">
                                                                    Some
                                                                    Description
                                                                </p>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </Menu.Item>
                                            ))}
                                        </ul>
                                    </Menu.Items>
                                </Transition>
                            </>
                        )}
                    </Menu>

                    <div className="flex-grow"></div>
                    <FeedbackFish
                        projectId="98bcbfde97c737"
                        userId={user.email ?? ""}
                    >
                        <button
                            title="feedback"
                            className="btn btn-ghost btn-square text-sm my-auto"
                        >
                            <SupportIcon className="h-5 w-5" />
                        </button>
                    </FeedbackFish>

                    <Menu
                        as="div"
                        className="relative inline-block text-left z-50"
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
                                                image={user?.image}
                                            />
                                        </div>
                                    </Menu.Button>
                                </div>
                                <Transition open={open}>
                                    <Menu.Items
                                        static
                                        className="  absolute right-0   origin-top-right  "
                                    >
                                        <ul className="bg-base-300  menu rounded-box p-2 shadow-lg shadow-black/30 w-56 space-y-1">
                                            <Menu.Item as={"li"}>
                                                <Link href={"/"}>
                                                    <a>
                                                        <PencilAltIcon className="h-5 w-5" />
                                                        Edit
                                                    </a>
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item as={"li"}>
                                                <Link href={"/"}>
                                                    <a>
                                                        <PencilAltIcon className="h-5 w-5" />
                                                        Edit
                                                    </a>
                                                </Link>
                                            </Menu.Item>
                                        </ul>
                                    </Menu.Items>
                                </Transition>
                            </>
                        )}
                    </Menu>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default TimesheetMenu;
