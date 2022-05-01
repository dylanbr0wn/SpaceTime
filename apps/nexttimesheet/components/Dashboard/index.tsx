import * as React from "react";

import Menu from "../Menu";

const DashBoard = ({ children }) => {
    return (
        <div className="w-screen min-h-screen h-screen bg-slate-900 appearance-none ">
            <Menu />
            <div className="max-w-screen-2xl mx-auto pt-4">{children}</div>
        </div>
    );
};

export default DashBoard;
