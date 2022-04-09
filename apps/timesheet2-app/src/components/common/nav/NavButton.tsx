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
                <div className="flex p-2 duration-300 w-56 mx-auto font-medium bg-transparent hover:bg-sky-500 border border-transparent hover:text-white shadow-lg shadow-transparent hover:shadow-sky-500/25 rounded-lg mt-1 text-slate-500 text-center transition-all">
                    <div className="mx-2">{icon}</div>
                    <div className="text-left ml-3 flex-grow w-full">
                        {title}
                    </div>
                </div>
            </NavLink>
        </div>
    );
};

export default NavButton;
