import * as React from "react";
import { NavLink } from "react-router-dom";

type NavButtonProps = {
    url: string;
    title: string;
    icon: React.ReactElement<any, any>;
};

const NavButton = ({ url, title, icon }: NavButtonProps) => {
    return (
        <div className=" w-full">
            <NavLink to={url}>
                <div className="flex w-64 p-2 group mx-auto bg-transparent hover:bg-teal-500 hover:text-white rounded-lg my-0.5 text-slate-300 transition-colors">
                    <div className=" w-12 h-12 p-3 text-white rounded-md">
                        {icon}
                    </div>
                    <div className="text-left">
                        <div className="ml-4">
                            <p className="text-sm font-medium">{title}</p>
                            <p className="text-sm text-slate-500 group-hover:text-white transition-colors">
                                Some Description
                            </p>
                        </div>
                    </div>
                    <div></div>
                </div>
            </NavLink>
        </div>
    );
};

export default NavButton;
