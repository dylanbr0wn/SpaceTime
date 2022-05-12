import * as React from "react";

import CopyField from "../../common/CopyField";

const Success = ({ token }: { token: string }) => {
    return (
        <div className="">
            <div className="text-success text-center mb-4 text-lg font-bold">
                User created successfully!
            </div>
            A one time token has been generated for them below. They can use
            this token to set up their account.
            <div className="mt-2 text-sm">
                <strong className="text-warning"> Note: </strong>
                You are able to access this token at any time in the Tokens
                section of the admin panel.
            </div>
            <div className="mt-3 flex justify-center">
                <CopyField value={token} />
            </div>
        </div>
    );
};
export default Success;
