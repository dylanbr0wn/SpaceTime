import Link from "next/link";
import * as React from "react";

import { Menu } from "@headlessui/react";
import MenuLink from "./MenuLink";

interface NavButtonProps {
	href: string;
	title: string;
	icon: React.ReactElement<any, any>;
}

const NavButton = ({ href, title, icon }: NavButtonProps) => {
	return (
		<Menu.Item as="li">
			<MenuLink href={href}>
				{icon}
				<div>
					<p className="text-sm font-medium">{title}</p>
					<p className="text-sm text-base-content group-hover:text-white transition-colors">
						Some Description
					</p>
				</div>
			</MenuLink>
		</Menu.Item>
	);
};

export default NavButton;
