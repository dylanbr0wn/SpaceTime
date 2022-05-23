import { useRouter } from "next/router";
import { Session } from "next-auth";
import * as React from "react";

import { useMutation, useQuery } from "@apollo/client";

import Loading from "../../../components/common/Loading";
import RegisterComponent from "../../../components/register/Register";
import {
    CreateUserDocument,
    UserFromAuthIdDocument,
} from "../../../lib/apollo";

const Register = ({ user }: { user: Session["user"] }) => {
    const router = useRouter();
    const { data, error, loading } = useQuery(UserFromAuthIdDocument, {
        variables: {
            authId: String(user?.sub),
        },
    });
    const [createUser, { data: newUserData, loading: loadingNewUser }] =
        useMutation(CreateUserDocument);

    React.useEffect(() => {
        if (
            error?.graphQLErrors &&
            !loading &&
            !loadingNewUser &&
            !newUserData?.createUser &&
            user
        ) {
            createUser({
                variables: {
                    authId: String(user?.sub),
                    email: user?.email ?? "",
                    name: user?.name ?? "",
                    avatar: user.image ?? "",
                },
                update: (cache, { data: createData }) => {
                    cache.updateQuery(
                        {
                            query: UserFromAuthIdDocument,
                            variables: {
                                authId: String(user?.sub),
                            },
                        },
                        (data) => {
                            if (!createData?.createUser) return;
                            return {
                                userFromAuthId: createData.createUser,
                            };
                        }
                    );
                },
            });
        }
    }, [user, data, error, createUser, loading, newUserData, loadingNewUser]);

    React.useEffect(() => {
        if (data?.userFromAuthId?.tenant?.id) {
            router.push("/");
        }
    }, [data?.userFromAuthId, router]);

    return (
        <div className="h-full w-full">
            <React.Suspense fallback={<Loading />}>
                <RegisterComponent user={data?.userFromAuthId} />
            </React.Suspense>
        </div>
    );
};
Register.auth = true;
export default Register;
