import * as React from "react";
import { Outlet } from "react-router-dom";

import Menu from "../Menu";

const DashBoard = () => {
    return (
        <div className="w-full h-full">
            <Menu />
            <Outlet />
        </div>
    );
};

export default DashBoard;
