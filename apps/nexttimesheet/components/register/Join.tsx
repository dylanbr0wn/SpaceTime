import { useRouter } from "next/router";
import * as React from "react";

import { useGetUserFromTokenLazyQuery } from "../../lib/apollo";

const Join = () => {
    const [attempted, setAttempted] = React.useState(false);

    const [getUserFromTokenLazy, { loading, data: TenantData, error }] =
        useGetUserFromTokenLazyQuery();

    const router = useRouter();

    const [token, setToken] = React.useState("");

    const onSubmit = () => {
        getUserFromTokenLazy({ variables: { token } });
    };

    React.useEffect(() => {
        if (TenantData?.getUserFromToken) {
            router.replace(`/register/token/${token}`);
        }
    }, [TenantData, router, token]);

    React.useEffect(() => {
        if (loading) {
            setAttempted(true);
        }
    }, [loading]);

    return (
        <>
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <div className="label-text">
                        Please enter your one time token provided by your team
                        manager.
                    </div>
                </label>
                <input
                    value={token}
                    onChange={(e) => {
                        setToken(e.target.value);
                        setAttempted(false);
                    }}
                    type={"text"}
                    placeholder="Your one time token"
                    className={`input input-bordered w-full my-3 ${
                        !loading && attempted ? "btn-warning" : ""
                    }`}
                />

                <label className="label">
                    <p className="label-text-alt text-warning">
                        {!loading && attempted && "The token is invalid"}
                    </p>
                </label>
            </div>

            <button onClick={onSubmit} className="btn ">
                Submit
            </button>
        </>
    );
};
export default Join;
