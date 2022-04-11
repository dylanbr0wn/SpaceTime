import * as React from "react";
import { NavLink } from "react-router-dom";

type NavButtonProps = {
    url: string;
    title: string;
    icon: JSX.Element;
};

const NavButton = ({ url, title, icon }: NavButtonProps) => {
    return (
        <div className=" w-full">
            <NavLink to={url}>
                <div className="flex w-64 p-2 duration-300 mx-auto bg-transparent hover:bg-slate-800 hover:text-white rounded-lg mt-1 text-slate-500 transition-all">
                    <div className=" w-12 h-12 p-3 shadow-md shadow-sky-400/25 bg-cyan-500 text-white rounded-md">
                        {icon}
                    </div>
                    <div className="text-left">
                        <div className="ml-4">
                            <p className="text-sm font-medium">{title}</p>
                            <p className="text-sm text-gray-500">
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
