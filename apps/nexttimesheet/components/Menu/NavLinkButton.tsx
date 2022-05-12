import Link from "next/link";
import * as React from "react";

type NavButtonProps = {
    url: string;
    title: string;
    icon: React.ReactElement<any, any>;
};

const NavButton = ({ url, title, icon }: NavButtonProps) => {
    return (
        <li className=" w-full">
            <Link href={url} title={title} replace>
                <a className="flex w-64 p-2 group mx-auto bg-transparent hover:bg-accent hover:text-white rounded-lg my-0.5 text-base-content transition-colors">
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
        </li>
    );
};

export default NavButton;
