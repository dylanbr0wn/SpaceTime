import { Form, Formik, FormikHelpers } from "formik";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import * as React from "react";
import validator from "validator";

import { useQuery } from "@apollo/client";

import {
    FieldsDocument,
    TenantDocument,
    UserFromAuthIdDocument,
} from "../../lib/apollo";
import MultiSelectInput from "../common/form/MultiSelectInput";
import Section from "../common/form/Section";
import SelectInput from "../common/form/SelectInput";
import TextInput from "../common/form/TextInput";
import Loading from "../common/Loading";

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

    return (
        <div className="w-full h-full flex flex-col">
            {!tenantLoading && !userLoading ? (
                <div className="w-1/2">
                    Tenant Settings
                    <div>Name: {tenantData?.tenant?.name}</div>
                    <div>Description: {tenantData?.tenant?.description}</div>
                    <div>Logo: {tenantData?.tenant?.logo}</div>
                    <div>PeriodLength: {tenantData?.tenant?.periodLength}</div>
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
                        }}
                        onSubmit={async (
                            values: tenantInfo,
                            {
                                setSubmitting,
                                setStatus,
                            }: FormikHelpers<tenantInfo>
                        ) => {
                            console.log(values);
                            // let date = DateTime.now();
                            // while (
                            //     date.weekday !== parseInt(values.startDate.id)
                            // ) {
                            //     date = date.minus({ days: 1 });
                            // }
                            // const startDate = date
                            //     .startOf("day")
                            //     .toUTC()
                            //     .startOf("day")
                            //     .toISO();

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

                            // setStatus("complete");
                            // setSubmitting(false);
                        }}
                    >
                        {({ isValid, dirty, isSubmitting, status }) => (
                            <Form className="p-3 flex flex-col space-y-2">
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
                                <Section>
                                    <div className="flex flex-col">
                                        <MultiSelectInput
                                            validate={() => undefined}
                                            label="Column Fields"
                                            name="columnFields"
                                            elements={fieldsData?.fields ?? []}
                                            placeholder=""
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
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default Settings;
