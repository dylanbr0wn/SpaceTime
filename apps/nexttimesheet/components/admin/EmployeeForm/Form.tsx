import cuid from "cuid";
import { Form, Formik, FormikHelpers } from "formik";
import * as React from "react";
import validator from "validator";

import {
    Department,
    useCreateOneTimeTokenMutation,
    useCreateUserMutation,
    useDepartmentsQuery,
    User,
} from "../../../lib/apollo";
import CheckBox from "../../common/form/CheckBox";
import Section from "../../common/form/Section";
import SelectInput from "../../common/form/SelectInput";
import TextInput from "../../common/form/TextInput";

type formUser = Omit<Omit<Partial<User>, "department">, "manager"> & {
    tenantId: string;
    managerId: string;
    department: Partial<Department>;
    manager: Partial<User>;
};

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

const validateCode = (code: string) => {
    if (!code) {
        return "A code is required!";
    } else if (!validator.isAscii(code)) {
        return "Please only use ASCII characters!";
    }
    return undefined;
};

const UserForm = ({ currentUser }: { currentUser: Partial<User> }) => {
    const { data } = useDepartmentsQuery();

    const [createUserMutation, { data: newUserData, loading: newUserLoading }] =
        useCreateUserMutation();

    const [
        createOneTimeTokenMutation,
        { data: tokenData, loading: tokenLoading },
    ] = useCreateOneTimeTokenMutation();

    React.useEffect(() => {
        if (newUserData && !tokenData) {
            if (newUserData?.createUser?.id && currentUser?.tenant?.id)
                createOneTimeTokenMutation({
                    variables: {
                        userId: newUserData?.createUser?.id,
                        tenantId: currentUser?.tenant?.id,
                    },
                });
        }
    }, [tokenData, newUserData, createOneTimeTokenMutation, currentUser]);

    return (
        <div>
            <Formik
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
                    { setSubmitting }: FormikHelpers<formUser>
                ) => {
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
                                departmentId: values?.department?.id ?? "-1",
                                managerId: currentUser?.id ?? "-1",
                                isPaymentManager:
                                    values?.isPaymentManager ?? false,
                                avatar: "",
                            },
                        },
                    });
                    setSubmitting(false);
                }}
            >
                <Form className="p-3 flex flex-col space-y-2">
                    <Section title="Details">
                        <div className="flex flex-col mx-1">
                            <TextInput
                                label="Name"
                                name="name"
                                id="name"
                                placeholder="Anakin Skywalker"
                                validate={validateName}
                            />
                        </div>
                        <div className="flex flex-col mx-1">
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
                        <div className="flex flex-col mx-1">
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
                        <div className="flex flex-col mx-1">
                            <SelectInput
                                name="department"
                                label="Department"
                                elements={data?.departments ?? []}
                            />
                        </div>
                        <div className="flex flex-col mx-1">
                            <SelectInput
                                name="department"
                                label="Department"
                                elements={data?.departments ?? []}
                            />
                        </div>
                    </Section>

                    <Section title="Status">
                        <div className="flex flex-col mx-1 mt-2">
                            <CheckBox
                                name="isActive"
                                id="isActive"
                                label="Is an active user"
                                type="checkbox"
                            />
                        </div>
                    </Section>
                    <Section title="Permissions">
                        <div className="flex flex-col mx-1 mt-2">
                            <CheckBox
                                name="isAdmin"
                                id="isAdmin"
                                label="Administrator?"
                                type="checkbox"
                            />
                        </div>

                        <div className="flex flex-col mx-1 mt-2">
                            <CheckBox
                                name="isManager"
                                id="isManager"
                                label="Manager?"
                                type="checkbox"
                            />
                        </div>
                        <div className="flex flex-col mx-1 mt-2">
                            <CheckBox
                                name="isPaymentManager"
                                id="isPaymentManager"
                                label="Payment Manager?"
                                type="checkbox"
                            />
                        </div>
                    </Section>

                    <div className="flex mt-3">
                        <button className="btn-outline" type="submit">
                            Submit
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default UserForm;
