import { useRouter } from "next/router";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import * as React from "react";

import RegisterComponent from "../../../components/register/Register";

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    if (!session) {
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false,
            },
        };
    }
    return {
        props: {
            session,
        },
    };
};

const Register = () => {
    return (
        <div className="h-full w-full">
            <RegisterComponent />
        </div>
    );
};
export default Register;
