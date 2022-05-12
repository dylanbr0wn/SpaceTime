import cuid from "cuid";
import { Form, Formik, FormikHelpers } from "formik";
import * as React from "react";
import toast from "react-hot-toast";
import validator from "validator";

import {
    Department,
    GetOneTimeTokensDocument,
    useCreateOneTimeTokenMutation,
    useCreateUserMutation,
    useDepartmentsQuery,
    useGetUserFromCodeLazyQuery,
    useManagersQuery,
    User,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import CheckBox from "../../common/form/CheckBox";
import Section from "../../common/form/Section";
import SelectInput from "../../common/form/SelectInput";
import TextInput from "../../common/form/TextInput";

import Success from "./Success";

const notify = (error: string) => toast.error(error);

type formUser = Omit<Omit<Partial<User>, "department">, "manager"> & {
    tenantId: string;
    department: Partial<Department>;
    manager: Partial<User>;
};

const UserForm = ({ currentUser }: { currentUser: Partial<User> }) => {
    const [getUserFromCode] = useGetUserFromCodeLazyQuery();

    const validateEmail = (email: string) => {
        if (!email) {
            return "An email is required!";
        } else if (!validator.isEmail(email)) {
            return "Please enter a valid email!";
        }
        return undefined;
    };

    const validateName = (name: string) => {
        if (!name) {
            return "A name is required!";
        } else if (!validator.isAscii(name)) {
            return "Please only use ASCII characters!";
        }
        return undefined;
    };

    const validateCode = async (code: string) => {
        if (!code) {
            return "A code is required!";
        } else if (!validator.isAscii(code)) {
            return "Please only use ASCII characters!";
        } else {
            const { data, error } = await getUserFromCode({
                variables: {
                    code,
                    tenantId: currentUser?.tenant?.id ?? "-1",
                },
            });
            if (error) {
                notify(error.message);
                return "It's an older code, sir, but it checks out...";
            }
            if (data?.getUserFromCode) {
                return "That code is already in use!";
            }
        }
        return undefined;
    };

    const validateDepartment = (department: Partial<Department>) => {
        if (!department?.id) {
            return "A department is required!";
        }
        return undefined;
    };

    const validateManager = (manager: Partial<User>) => {
        return undefined;
    };
    const { data } = useDepartmentsQuery();

    const { data: managersData } = useManagersQuery({
        variables: {
            tenantId: currentUser?.tenant?.id ?? "-1",
        },
    });

    const [createUserMutation] = useCreateUserMutation();

    const [createOneTimeTokenMutation, { data: tokenData }] =
        useCreateOneTimeTokenMutation();

    // React.useEffect(() => {
    //     if (newUserData && !tokenData) {
    //     }
    // }, [tokenData, newUserData, createOneTimeTokenMutation, currentUser]);

    return (
        <ErrorBoundary>
            <Formik
                validateOnBlur
                initialValues={{
                    code: "",
                    email: "",
                    tenantId: currentUser?.tenant?.id ?? "-1",
                    auth0Id: "",
                    isAdmin: false,
                    isActive: true,
                    isManager: false,
                    department: {},
                    manager: {},
                    isPaymentManager: false,
                    name: "",
                    avatar: "",
                }}
                onSubmit={async (
                    values: formUser,
                    { setSubmitting, setStatus }: FormikHelpers<formUser>
                ) => {
                    const { data: newUserData, errors } =
                        await createUserMutation({
                            variables: {
                                user: {
                                    code: values?.code ?? "",
                                    email: values?.email ?? "",
                                    tenantId: values?.tenantId ?? "-1",
                                    auth0Id: cuid(),
                                    isAdmin: values?.isAdmin ?? false,
                                    isActive: values?.isActive ?? true,
                                    isManager: values?.isManager ?? false,
                                    departmentId:
                                        values?.department?.id ?? "-1",
                                    managerId: values?.manager?.id ?? "-1",
                                    isPaymentManager:
                                        values?.isPaymentManager ?? false,
                                    avatar: "",
                                    name: values?.name ?? "",
                                },
                            },
                        });
                    if (errors) return;
                    if (newUserData?.createUser?.id && currentUser?.tenant?.id)
                        await createOneTimeTokenMutation({
                            variables: {
                                userId: newUserData?.createUser?.id,
                                tenantId: currentUser?.tenant?.id,
                            },
                            refetchQueries: [GetOneTimeTokensDocument],
                        });
                    setStatus("complete");
                    setSubmitting(false);
                }}
            >
                {({ isValid, touched, isSubmitting, status }) => (
                    <Form className="p-3 flex flex-col space-y-2">
                        {status === "complete" ? (
                            <Success
                                token={tokenData?.createOneTimeToken?.id ?? ""}
                            />
                        ) : (
                            <>
                                <Section title="Details">
                                    <div className="flex flex-col w-full">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            id="name"
                                            placeholder="Anakin Skywalker"
                                            validate={validateName}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <TextInput
                                            validate={validateEmail}
                                            label="Email"
                                            name="email"
                                            id="email"
                                            placeholder="ani66@sith.ca"
                                        />
                                    </div>
                                </Section>
                                <Section>
                                    <div className="flex flex-col w-full">
                                        <TextInput
                                            validate={validateCode}
                                            label="Code"
                                            name="code"
                                            id="code"
                                            placeholder="ANI66"
                                        />
                                    </div>
                                </Section>
                                <Section>
                                    <div className="flex flex-col w-full">
                                        <SelectInput
                                            validate={validateDepartment}
                                            placeholder="Sith Lord"
                                            name="department"
                                            label="Department"
                                            elements={data?.departments ?? []}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <SelectInput
                                            validate={validateManager}
                                            placeholder="Darth Plagueis"
                                            name="manager"
                                            label="Manager"
                                            elements={
                                                managersData?.managers ?? []
                                            }
                                        />
                                    </div>
                                </Section>

                                <Section title="Status">
                                    <div className="flex flex-col w-full mt-2">
                                        <CheckBox
                                            name="isActive"
                                            id="isActive"
                                            label="Is an active user"
                                            type="checkbox"
                                        />
                                    </div>
                                </Section>
                                <Section title="Permissions">
                                    <div className="flex flex-col w-full mt-2">
                                        <CheckBox
                                            name="isAdmin"
                                            id="isAdmin"
                                            label="Administrator?"
                                            type="checkbox"
                                        />
                                    </div>

                                    <div className="flex flex-col w-full mt-2">
                                        <CheckBox
                                            name="isManager"
                                            id="isManager"
                                            label="Manager?"
                                            type="checkbox"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full mt-2">
                                        <CheckBox
                                            name="isPaymentManager"
                                            id="isPaymentManager"
                                            label="Payment Manager?"
                                            type="checkbox"
                                        />
                                    </div>
                                </Section>

                                <div className="flex mt-3">
                                    <button
                                        disabled={!isValid}
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </Formik>
        </ErrorBoundary>
    );
};

export default UserForm;
