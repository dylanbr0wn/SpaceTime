import * as React from "react";

import { Menu, Popover } from "@headlessui/react";
import { ViewGridIcon as ViewGridIconOutline } from "@heroicons/react/outline";
import { ViewGridIcon as ViewGridIconSolid } from "@heroicons/react/solid";

const NavMenuButton = ({ open }: { open: boolean }) => {
	return (
		<Menu.Button className="swap btn-ghost btn btn-square mt-2 relative group">
			<input type={"checkbox"} checked={open} onChange={() => {}} />
			<div className="absolute swap-on inset-0 ">
				<ViewGridIconSolid className="w-9 h-9 mt-1 mx-auto stroke-1" />
			</div>

			<div className="absolute swap-off inset-0">
				<ViewGridIconOutline className="w-9 h-9 mt-1 mx-auto stroke-1" />
			</div>
		</Menu.Button>
	);
};
export default NavMenuButton;
