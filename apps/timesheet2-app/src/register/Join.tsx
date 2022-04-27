import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    useGetUserFromAuth0LazyQuery,
    useGetUserFromTokenLazyQuery,
    useTenantFromIdLazyQuery,
} from "../api";
import { Navigate } from "../components/common/AuthProvider";

const Join = () => {
    const [attempted, setAttempted] = React.useState(false);

    const [getUserFromTokenLazy, { loading, data: TenantData, error }] =
        useGetUserFromTokenLazyQuery();

    const [token, setToken] = React.useState("");
    const navigate = useNavigate();

    const onSubmit = () => {
        getUserFromTokenLazy({ variables: { token } });
    };

    React.useEffect(() => {
        if (TenantData?.getUserFromToken) {
            navigate(`/register/token/${token}`, {
                replace: true,
            });
        }
    }, [TenantData, navigate, token]);

    React.useEffect(() => {
        if (loading) {
            setAttempted(true);
        }
    }, [loading]);

    return (
        <div className="flex flex-col">
            <div className=" w-96 text-sky-200 p-4">
                Please enter your one time token provided by your tenant.
            </div>
            <div className="w-96 flex flex-col">
                <input
                    value={token}
                    onChange={(e) => {
                        setToken(e.target.value);
                        setAttempted(false);
                    }}
                    type={"text"}
                    placeholder="Your one time token"
                    className={` ${
                        !loading && attempted
                            ? "border text-pink-600 border-pink-600"
                            : "text-sky-300 border border-slate-700"
                    } bg-slate-700 hover:bg-slate-600 caret-sky-300  rounded ring-0 focus:ring-sky-500 w-56 mx-auto placeholder:text-slate-400`}
                />
                <p className="mt-2 h-5 text-pink-600 text-sm text-center">
                    {!loading && attempted && "The token is invalid"}
                </p>
            </div>
            <div className="w-96 flex mt-2">
                <div className="bg-sky-500 border-sky-500 border rounded mx-auto">
                    <button
                        onClick={onSubmit}
                        className="bg-slate-800 p-2 rounded text-sky-300  hover:text-white hover:bg-sky-500 transition-colors "
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Join;
