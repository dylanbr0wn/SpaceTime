import * as React from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import {
    Department,
    useCreateOneTimeTokenMutation,
    useCreateUserMutation,
    useDepartmentsQuery,
    User,
} from "../../lib/apollo";
import { useUser } from "@auth0/nextjs-auth0";
import TextInput from "../common/form/TextInput";
import CheckBox from "../common/form/CheckBox";
import Section from "../common/form/Section";
import SelectInput from "../common/form/SelectInput";
import cuid from "cuid";

/**
 * @name EmployeeForm
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Form for editting a employee object and associated work codes.
 */

type formUser = Omit<Partial<User>, "department"> & {
    tenantId: string;
    managerId: string;
    department: Partial<Department>;
};

const validateEmail = (email) => {};

const EmployeeForm = ({ currentUser }: { currentUser: Partial<User> }) => {
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
        <div className="max-w-3xl mx-auto">
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
                    managerId: "",
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
                                managerId: values?.managerId ?? "-1",
                                isPaymentManager:
                                    values?.isPaymentManager ?? false,
                                avatar: "",
                            },
                        },
                    });
                    setSubmitting(false);
                }}
            >
                {({ errors, touched, values }) => (
                    <Form className="p-3 flex flex-col space-y-2">
                        <Section title="Details">
                            <div className="flex flex-col mx-1">
                                <TextInput
                                    label="Name"
                                    name="name"
                                    id="name"
                                    placeholder="Anakin Skywalker"
                                />
                            </div>
                            <div className="flex flex-col mx-1">
                                <TextInput
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
                                    label="Code"
                                    name="code"
                                    id="code"
                                    placeholder="ANI66"
                                />
                            </div>
                            <div className="flex flex-col mx-1">
                                <SelectInput
                                    name="department"
                                    label="Department"
                                    elements={data?.departments || []}
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
                )}
            </Formik>
        </div>
    );
};

export default EmployeeForm;
