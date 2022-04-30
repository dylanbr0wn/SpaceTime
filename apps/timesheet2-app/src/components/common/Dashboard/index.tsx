import * as React from "react";
import { Outlet } from "react-router-dom";

import Menu from "../Menu";

const DashBoard = () => {
    return (
        <div className=" w-full h-full">
            <Menu />
            <div className="max-w-screen-2xl mx-auto pt-4">
                <Outlet />
            </div>
        </div>
    );
};

export default DashBoard;
