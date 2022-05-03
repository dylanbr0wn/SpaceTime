import * as React from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { Department, User } from "../../lib/apollo";
import { useUser } from "@auth0/nextjs-auth0";
import v8n from "v8n";

/**
 * @name EmployeeForm
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Form for editting a employee object and associated work codes.
 */

type formUser = Partial<User> & {
    tenantId: string;
    departmentId: string;
    managerId: string;
};

const validateEmail = (email) => {
    
}



const EmployeeForm = () => {
    const initialFormValues: formUser = {
        code: "",
        email: "",
        tenantId: "",
        auth0Id: "",
        isAdmin: false,
        isActive: true,
        isManager: false,
        departmentId: "",
        managerId: "",
        isPaymentManager: false,
        name: "",
        avatar: "",
    };
    return (
        <div>
            <Formik
                initialValues={initialFormValues}
                onSubmit={(
                    values: formUser,
                    { setSubmitting }: FormikHelpers<formUser>
                ) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 500);
                }}
            >
                {({ errors, touched }) => (
                    <Form className="p-3 flex">
                        <div className="flex flex-col mx-1">
                            <label
                                className="text-sm text-sky-300"
                                htmlFor="lastName"
                            >
                                Last Name
                            </label>
                            <Field
                                className={` ${
                                    !errors
                                        ? "border text-pink-600 border-pink-600"
                                        : "text-sky-300 border border-slate-700"
                                } bg-slate-700 hover:bg-slate-600 caret-sky-300  rounded ring-0 focus:ring-sky-500 w-56 placeholder:text-slate-400`}
                                id="name"
                                name="name"
                                placeholder="C3PO"
                                type="text"
                            />
                            <ErrorMessage name="name" />
                        </div>
                        <div className="flex flex-col mx-1">
                            <label
                                className="text-sm text-sky-300"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <Field
                                className={` ${
                                    !errors
                                        ? "border text-pink-600 border-pink-600"
                                        : "text-sky-300 border border-slate-700"
                                } bg-slate-700 hover:bg-slate-600 caret-sky-300  rounded ring-0 focus:ring-sky-500 w-56 placeholder:text-slate-400`}
                                id="email"
                                name="email"
                                placeholder="john@acme.com"
                                type="email"
                            />
                            <ErrorMessage
                                className="text-pink-600"
                                name="name"
                            />
                        </div>

                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EmployeeForm;
