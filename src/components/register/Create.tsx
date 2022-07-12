import { Form, Formik, FormikHelpers } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import * as React from "react";
import validator from "validator";

import { useMutation } from "@apollo/client";

import {
    CreateTenantDocument,
    CreateUserMutation,
    UpdateUserDocument,
} from "../../../lib/apollo";
import ErrorBoundary from "../common/ErrorBoundary";
import Section from "../common/form/Section";
import SelectInput from "../common/form/SelectInput";
import TextInput from "../common/form/TextInput";

type tenantInfo = {
    name: string;
    description: string;
    periodLength: number;
    startDate: {
        id: string;
        name: string;
    };
};

const weeekdays = [
    { id: "1", name: "Sunday" },
    { id: "2", name: "Monday" },
    { id: "3", name: "Tuesday" },
    { id: "4", name: "Wednesday" },
    { id: "5", name: "Thursday" },
    { id: "6", name: "Friday" },
    { id: "7", name: "Saturday" },
];

const Create = ({
    user,
}: {
    user: CreateUserMutation["createUser"] | undefined;
}) => {
    const router = useRouter();

    const validateName = (name: string) => {
        if (!name) {
            return "A name is required!";
        } else if (!validator.isAscii(name)) {
            return "Please only use ASCII characters!";
        }
        return undefined;
    };

    const validatePeriodLength = (periodLength: string) => {
        if (!periodLength) {
            return "A period length is required!";
        } else if (!validator.isInt(String(periodLength))) {
            return "Please enter a valid number!";
        }
        return undefined;
    };
    const validateStartDate = (startDate: { id: string; name: string }) => {
        if (!startDate.id) {
            return "A start date is required!";
        }
        return undefined;
    };

    const [createTenant] = useMutation(CreateTenantDocument);

    const [updateUser] = useMutation(UpdateUserDocument);

    // const [createUser] = useQuery(CreateUserDocument);

    return (
        <div className="flex flex-col">
            <ErrorBoundary>
                <Formik
                    validateOnBlur
                    initialValues={{
                        name: "",
                        description: "",
                        periodLength: 14,
                        startDate: weeekdays[0],
                    }}
                    onSubmit={async (
                        values: tenantInfo,
                        { setSubmitting, setStatus }: FormikHelpers<tenantInfo>
                    ) => {
                        console.log(values);
                        let date = DateTime.now();
                        while (date.weekday !== parseInt(values.startDate.id)) {
                            date = date.minus({ days: 1 });
                        }
                        const startDate = date
                            .startOf("day")
                            .toUTC()
                            .startOf("day")
                            .toISO();

                        const { data: tenantData } = await createTenant({
                            variables: {
                                name: values.name,
                                description: values.description,
                                periodLength: values.periodLength,
                                startDate,
                                isActive: true,
                                logo: "",
                            },
                        });
                        console.log("tenant created");

                        console.log(user);

                        const { data: updatedUser } = await updateUser({
                            variables: {
                                id: String(user?.id),
                                tenantId: String(tenantData?.createTenant.id),
                            },
                        });

                        console.log("user updated");

                        if (updatedUser?.updateUser?.tenant?.id) {
                            router.push("/");
                        }

                        setStatus("complete");
                        setSubmitting(false);
                    }}
                >
                    {({ isValid, dirty, isSubmitting, status }) => (
                        <Form className="p-3 flex flex-col space-y-2">
                            <Section title="Team Details">
                                <div className="flex flex-col w-full">
                                    <TextInput
                                        label="Team Name"
                                        name="name"
                                        id="name"
                                        placeholder="Sith Lords"
                                        validate={validateName}
                                    />
                                </div>
                            </Section>
                            <Section>
                                <div className="flex flex-col w-full">
                                    <TextInput
                                        validate={() => undefined}
                                        label="Description"
                                        name="decription"
                                        id="description"
                                        placeholder="Roger roger!"
                                    />
                                </div>
                            </Section>
                            <Section title="Configuration">
                                <div className="flex flex-col">
                                    <TextInput
                                        validate={validatePeriodLength}
                                        label="Period Length"
                                        name="periodLength"
                                        id="periodLength"
                                        placeholder="14"
                                    />
                                </div>
                                <div className="flex flex-col w-48">
                                    <SelectInput
                                        validate={validateStartDate}
                                        placeholder="Sunday"
                                        name="startDate"
                                        label="Start Day"
                                        elements={weeekdays}
                                    />
                                </div>
                            </Section>
                            <div className="flex my-3">
                                <button
                                    disabled={
                                        !isValid || !dirty || isSubmitting
                                    }
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </ErrorBoundary>
        </div>
    );
};
export default Create;
