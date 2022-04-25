import { useAuth0 } from "@auth0/auth0-react";
import * as React from "react";
import { useParams } from "react-router-dom";

const UserDetails = () => {
    const { user } = useAuth0();

    const { tenantId } = useParams();

    return (
        <div className="flex flex-col">
            <div className=" w-96 text-sky-200 p-4">
                Perfect. Now we just need a little more information from you
                before we can get started.
            </div>
        </div>
    );
};

export default UserDetails;
