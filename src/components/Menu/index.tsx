import Link from "next/link";
import { useSession } from "next-auth/react";
import * as React from "react";

import { FeedbackFish } from "@feedback-fish/react";
import { Menu } from "@headlessui/react";
import { PencilAltIcon, SupportIcon } from "@heroicons/react/outline";

import Avatar from "../common/Avatar";
import Transition from "../common/CustTransition";
import ErrorBoundary from "../common/ErrorBoundary";

/**
 * @name Sidebar
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Sidebar navigation menu.
 */
const TimesheetMenu = () => {
    // const { userMetadata, user } = useProfile();
    const { data: sessionData } = useSession();

    return (
        <ErrorBoundary>
            <div
                className="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 
 bg-base-200 text-base-content"
            >
                <div className="navbar ">
                    <div className="flex-1">
                        <label
                            htmlFor="my-drawer-2"
                            className="btn btn-primary drawer-button lg:hidden"
                        >
                            Open drawer
                        </label>
                        {/* <Menu as={"div"} className={"relative"}>
                        {({ open }) => (
                            <>
                                <NavMenuButton open={open} />
                                <Transition open={open}>
                                    <Menu.Items static className="">
                                        <ul className="bg-base-300 menu rounded-box shadow-lg shadow-black/30 text-base w-64 p-2 space-y-1">
                                            {menu.map((item, index) => (
                                                <NavButton
                                                    key={index}
                                                    {...item}
                                                />
                                            ))}
                                        </ul>
                                    </Menu.Items>
                                </Transition>
                            </>
                        )}
                    </Menu> */}
                    </div>
                    <div className="flex-none gap-2">
                        <FeedbackFish
                            projectId="98bcbfde97c737"
                            userId={sessionData?.user?.email ?? ""}
                        >
                            <button
                                title="feedback"
                                className="btn btn-ghost btn-square text-sm my-auto"
                            >
                                <SupportIcon className="h-5 w-5" />
                            </button>
                        </FeedbackFish>

                        <Menu as="div" className="relative  z-50">
                            {({ open }) => (
                                <>
                                    <div className="h-16  py-2">
                                        <Menu.Button className=" inline-flex justify-end h-full w-full  font-medium text-base-content btn btn-ghost  ">
                                            <div className="h-full mr-3 flex flex-col text-right">
                                                <div className="my-auto">
                                                    {sessionData?.user?.name}
                                                </div>
                                            </div>

                                            <div className="">
                                                <Avatar
                                                    name={
                                                        sessionData?.user?.name
                                                    }
                                                    image={
                                                        sessionData?.user?.image
                                                    }
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
            </div>

            {/* <div className="w-full h-16  z-50">
                <div className=" max-w-screen-xl mx-auto h-full flex"></div>
            </div> */}
        </ErrorBoundary>
    );
};

export default TimesheetMenu;
