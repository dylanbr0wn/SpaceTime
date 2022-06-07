import { Form, Formik, FormikHelpers } from "formik";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import * as React from "react";
import validator from "validator";

import { useMutation, useQuery } from "@apollo/client";

import {
    FieldsDocument,
    TenantDocument,
    UpdateTenantDocument,
    UserFromAuthIdDocument,
} from "../../lib/apollo";
import MultiSelectInput from "../common/form/MultiSelectInput";
import Section from "../common/form/Section";
import SelectInput from "../common/form/SelectInput";
import TextInput from "../common/form/TextInput";
import Loading from "../common/Loading";
import MultiSelectList from "../common/form/MultiSelectList";
import toast from "react-hot-toast";

const notify = (error: string) => toast.error(error);

type tenantInfo = {
    name: string;
    description: string;
    periodLength: number;
    startDate: {
        id: string;
        name: string;
    };
    fields: string[];
};

const weeekdays = [
    { id: "2", name: "Monday" },
    { id: "3", name: "Tuesday" },
    { id: "4", name: "Wednesday" },
    { id: "5", name: "Thursday" },
    { id: "6", name: "Friday" },
    { id: "7", name: "Saturday" },
    { id: "1", name: "Sunday" },
];

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

const Settings = () => {
    const session = useSession();

    const { data: userData, loading: userLoading } = useQuery(
        UserFromAuthIdDocument,
        {
            variables: {
                authId: String(session?.data?.user?.sub),
            },
            skip: !session?.data?.user?.sub,
        }
    );

    const { data: tenantData, loading: tenantLoading } = useQuery(
        TenantDocument,
        {
            variables: {
                tenantId: String(userData?.userFromAuthId?.tenant?.id),
            },
            skip: !userData?.userFromAuthId?.tenant?.id,
        }
    );

    const { data: fieldsData } = useQuery(FieldsDocument, {
        variables: {
            tenantId: String(userData?.userFromAuthId?.tenant?.id),
        },
    });

    const [UpdateTenant] = useMutation(UpdateTenantDocument);

    return (
        <div className="w-full h-full flex flex-col">
            {!tenantLoading && !userLoading ? (
                <div className="">
                    <Formik
                        validateOnBlur
                        initialValues={{
                            name: tenantData?.tenant?.name ?? "",
                            description: tenantData?.tenant?.description ?? "",
                            periodLength:
                                tenantData?.tenant?.periodLength ?? 14,
                            startDate:
                                typeof tenantData?.tenant?.startDate ===
                                "string"
                                    ? weeekdays[
                                          DateTime.fromISO(
                                              tenantData?.tenant?.startDate ??
                                                  ""
                                          ).weekday - 1
                                      ]
                                    : weeekdays[
                                          DateTime.fromJSDate(
                                              tenantData?.tenant?.startDate ??
                                                  new Date()
                                          ).weekday - 1
                                      ] ?? weeekdays[0],
                            fields:
                                tenantData?.tenant?.tenantActivefields.map(
                                    (activeField) => activeField.field.id
                                ) ?? [],
                        }}
                        onSubmit={async (
                            values: tenantInfo,
                            {
                                setSubmitting,
                                setStatus,
                            }: FormikHelpers<tenantInfo>
                        ) => {
                            let date = DateTime.now();
                            while (
                                date.weekday !== parseInt(values.startDate.id)
                            ) {
                                date = date.minus({ days: 1 });
                            }
                            const startDate = date
                                .startOf("day")
                                .toUTC()
                                .startOf("day")
                                .toISO();

                            const { data, errors } = await UpdateTenant({
                                variables: {
                                    name: values.name,
                                    description: values.description,
                                    periodLength: values.periodLength,
                                    startDate,
                                    isActive: true,
                                    logo: "",
                                    updateTenantId:
                                        tenantData?.tenant?.id ?? "-1",
                                    tenantActiveFields: values.fields,
                                },
                                refetchQueries: [TenantDocument],
                            });

                            if (errors) {
                                setStatus(errors[0].message);
                                notify(errors[0].message);
                            }
                            // const { data: tenantData } = await createTenant({
                            //     variables: {
                            //         name: values.name,
                            //         description: values.description,
                            //         periodLength: values.periodLength,
                            //         startDate,
                            //         isActive: true,
                            //         logo: "",
                            //     },
                            // });
                            // console.log("tenant created");

                            // console.log(user);

                            // const { data: updatedUser } = await updateUser({
                            //     variables: {
                            //         id: String(user?.id),
                            //         tenantId: String(
                            //             tenantData?.createTenant.id
                            //         ),
                            //     },
                            // });

                            // console.log("user updated");

                            // if (updatedUser?.updateUser?.tenant?.id) {
                            //     router.push("/");
                            // }

                            setStatus("complete");
                            setSubmitting(false);
                        }}
                    >
                        {({ isValid, dirty, isSubmitting, status }) => (
                            <Form className="p-3 flex flex-col space-y-2">
                                <div className="flex">
                                    <div className="w-full px-3">
                                        <Section title="Tenant Details">
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
                                                    validate={
                                                        validatePeriodLength
                                                    }
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
                                        <Section>
                                            <div className="flex flex-col">
                                                {/* <MultiSelectInput
                                            validate={() => undefined}
                                            label="Column Fields"
                                            name="columnFields"
                                            elements={fieldsData?.fields ?? []}
                                            placeholder=""
                                        /> */}
                                            </div>
                                        </Section>
                                        <div className="flex my-3">
                                            <button
                                                disabled={
                                                    !isValid ||
                                                    !dirty ||
                                                    isSubmitting
                                                }
                                                className="btn btn-primary"
                                                type="submit"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full px-3">
                                        <Section title="Default Fields">
                                            <div className="flex flex-col w-full space-y-2 py-2 overflow-y-scroll">
                                                Default columns for your
                                                timesheet. These are applied
                                                when you first visit a new sheet
                                                or on sheet reset.
                                                <MultiSelectList
                                                    validate={() => undefined}
                                                    name="fields"
                                                    label="Timesheet Fields"
                                                    placeholder="Select Fields"
                                                    elements={
                                                        fieldsData?.fields ?? []
                                                    }
                                                />
                                            </div>
                                        </Section>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default Settings;
