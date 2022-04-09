import * as React from "react";

type NavSubTitleProp = {
    title: string;
};

const NavSubTitle = ({ title }: NavSubTitleProp) => {
    return (
        <>
            <div className="group flex mt-5  ">
                <div className="font-medium bg-transparent text-sm transition-colors duration-300 text-slate-700 group-hover:text-slate-500 mx-1 my-1">
                    {title}
                </div>
                <div className="flex-grow text-sm bg-slate-700 transition-colors duration-300 group-hover:bg-slate-500 my-auto mx-1 h-[3px] rounded-md " />
            </div>
        </>
    );
};

export default NavSubTitle;
