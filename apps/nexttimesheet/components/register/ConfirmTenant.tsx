import { useRouter } from "next/router";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import * as React from "react";

import { useQuery } from "@apollo/client";

import {
    UserFromTokenDocument,
} from "../../lib/apollo";

const ConfirmTenant = ({ userData }: { userData: Session }) => {
    const router = useRouter();

    const { data: TenantData, loading } = useQuery(UserFromTokenDocument, {
        variables: {
            token: String(router.query.id),
        },
    });

    const [attachAuth0IdMutation, { data }] = useQuery();

    const onConfirm = () => {
        if (!TenantData?.getUserFromToken?.id) return;
        attachAuth0IdMutation({
            variables: {
                auth0Id: String(userData?.user?.sub),
                userId: TenantData?.getUserFromToken?.id,
            },
        });
    };

    React.useEffect(() => {
        if (data?.attachAuth0Id) {
            router.push("/");
        }
    }, [data, router]);

    const onCancel = () => {
        router.replace(`/register`);
    };

    return (
        <div className="w-full h-full bg-base-100 flex flex-col ">
            <div className="card m-auto bg-base-300 w-96">
                <div className="flex flex-col card-body ">
                    <div className="card-title">
                        Hi {TenantData?.getUserFromToken?.name}!
                    </div>
                    <p className="py-3">
                        You are now attempting to join the{" "}
                        <span className="text-purple-600 text-lg">
                            {TenantData?.getUserFromToken?.tenant.name ?? ""}
                        </span>{" "}
                        tenant. Is this correct?
                    </p>

                    <div className="card-actions">
                        <button
                            onClick={onCancel}
                            className="btn btn-outline btn-error"
                        >
                            Cancel
                        </button>

                        <button onClick={onConfirm} className="btn btn-primary">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ConfirmTenant;
