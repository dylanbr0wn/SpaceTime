import { useAuth0 } from "@auth0/auth0-react";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    GetUserFromAuth0Document,
    useAttachAuth0IdMutation,
    useGetUserFromTokenLazyQuery,
    useGetUserFromTokenQuery,
    useTenantFromIdQuery,
} from "../api";

const ConfirmTenant = () => {
    const { token } = useParams();

    const { user } = useAuth0();

    const { data: TenantData, loading } = useGetUserFromTokenQuery({
        variables: {
            token: String(token),
        },
    });

    const [attachAuth0IdMutation, { data }] = useAttachAuth0IdMutation();

    const navigate = useNavigate();

    const onConfirm = () => {
        if (!TenantData?.getUserFromToken?.id) return;
        attachAuth0IdMutation({
            variables: {
                auth0Id: String(user?.sub),
                userId: TenantData?.getUserFromToken?.id,
            },
            refetchQueries: [GetUserFromAuth0Document],
        });
    };

    React.useEffect(() => {
        if (data?.attachAuth0Id) {
            navigate("/");
        }
    }, [data, navigate]);

    const onCancel = () => {
        navigate(`/register/join`, {
            replace: true,
        });
    };

    return (
        <div className="flex flex-col">
            <div className=" w-96 text-sky-200 p-4">
                You are now attempting to join the{" "}
                <span className="text-purple-600 text-lg">
                    {TenantData?.getUserFromToken?.tenant.name ?? ""}
                </span>{" "}
                tenant. Is this correct?
            </div>
            <div className="w-96 flex mt-2 justify-center">
                <div className="bg-pink-600 border-pink-600 border rounded mx-3">
                    <button
                        onClick={onCancel}
                        className="bg-slate-800 p-2 rounded text-pink-300  hover:text-white hover:bg-pink-600 transition-colors "
                    >
                        Cancel
                    </button>
                </div>

                <button
                    onClick={onConfirm}
                    className="hover:bg-sky-700 p-2 rounded  text-white bg-sky-500 transition-colors mx-3"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};
export default ConfirmTenant;
