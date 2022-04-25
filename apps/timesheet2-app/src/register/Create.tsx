import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTenantFromIdLazyQuery } from "../api";
import { Navigate } from "../components/common/AuthProvider";

const Create = () => {
    return (
        <div className="flex flex-col">
            <div className=" w-96 text-sky-200 p-4">
                Please contact your tenant administrator to create a new tenant.
            </div>
        </div>
    );
};
export default Create;
