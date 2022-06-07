import * as React from "react";

import { CalendarIcon, UserGroupIcon } from "@heroicons/react/outline";

import Footer from "../Footer";
import Menu from "../Menu";
import MenuLink from "../Menu/MenuLink";

const DashBoard = ({ children }: { children: React.ReactNode }) => {
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
        <div data-theme="dark">
            <div className="drawer drawer-mobile">
                <input
                    id="my-drawer-2"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col">
                    <Menu />
                    <div className="w-full mx-auto h-full">{children}</div>
                    <Footer />
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="my-drawer-2"
                        className="drawer-overlay"
                    ></label>
                    <ul className="menu p-4 overflow-y-auto w-80 bg-base-300 text-base-content">
                        <li>ProtoTime</li>
                        {menu.map((item, index) => (
                            <li key={index}>
                                <MenuLink href={item.href}>
                                    {item.icon}
                                    <div>
                                        <p className="text-sm font-medium">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-base-content transition-colors">
                                            Some Description
                                        </p>
                                    </div>
                                </MenuLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
