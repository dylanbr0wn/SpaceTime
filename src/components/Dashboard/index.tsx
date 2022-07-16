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
		<div className="h-screen w-screen relative" data-theme="mytheme">
			<Menu />
			<div className="pt-16 h-full w-screen">
				{/* <div className="w-full mx-auto h-full relative"></div> */}
				{children}
			</div>
		</div>
	);
};

export default DashBoard;
