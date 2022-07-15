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
		<div data-theme="mytheme">
			<Menu />
			<div className="flex flex-col overflow-x-hidden overflow-y-scroll relative">
				<div className="w-full mx-auto h-full">{children}</div>
				{/* <Footer /> */}
			</div>
		</div>
	);
};

export default DashBoard;
