import Link from "next/link";
import * as React from "react";

import { Menu } from "@headlessui/react";

type NavButtonProps = {
    url: string;
    title: string;
    icon: React.ReactElement<any, any>;
};

const NavButton = ({ url, title, icon }: NavButtonProps) => {
    return (
        <Menu.Item as={"li"}>
            <Link href={url} title={title}>
                <a className="flex w-full p-2 group mx-auto bg-transparent hover:bg-accent hover:text-white text-base-content transition-colors">
                    <div className=" w-12 h-12 p-3 text-white rounded-md">
                        {icon}
                    </div>
                    <div className="text-left">
                        <div className="ml-4">
                            <p className="text-sm font-medium">{title}</p>
                            <p className="text-sm text-base-content group-hover:text-white transition-colors">
                                Some Description
                            </p>
                        </div>
                    </div>
                </a>
            </Link>
        </Menu.Item>
    );
};

export default NavButton;
