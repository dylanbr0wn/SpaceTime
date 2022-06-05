import * as React from "react";

import Menu from "../Menu";

const DashBoard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            data-theme="dark"
            className="w-screen min-h-screen  appearance-none "
        >
            <Menu />
            <div className="max-w-screen-2xl mx-auto pt-4 ">{children}</div>
        </div>
    );
};

export default DashBoard;
