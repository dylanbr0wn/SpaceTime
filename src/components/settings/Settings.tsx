import { Form, Formik, FormikHelpers } from "formik";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import * as React from "react";
import validator from "validator";

import MultiSelectInput from "../common/form/MultiSelectInput";
import Section from "../common/form/Section";
import SelectInput from "../common/form/SelectInput";
import TextInput from "../common/form/TextInput";
import Loading from "../common/Loading";
import MultiSelectList from "../common/form/MultiSelectList";
import toast from "react-hot-toast";
import { trpc } from "../../utils/trpc";
import {
	Field,
	Tenant,
	TenantActiveFields,
	User,
	zUser,
} from "../../utils/types/zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

interface ISettingsProps {
	tenant:
		| (Tenant & {
				tenantActivefields: (TenantActiveFields & {
					field: Field;
				})[];
		  })
		| undefined;
	tenantLoading: boolean;
	fields: Field[] | undefined;
}

const Settings = ({ tenantLoading, tenant, fields }: ISettingsProps) => {
	const {
		control,
		handleSubmit,
		formState: { isValid, isDirty, isSubmitting },
	} = useForm({
		resolver: zodResolver(
			z.object({
				name: z.string({
					required_error: "A name is required!",
					invalid_type_error: "Please only use regular characters!",
				}),
				periodLength: z.number({
					invalid_type_error: "Please enter a valid number!",
					required_error: "A period length is required!",
				}),
				startDate: z.number({ required_error: "A start date is required!" }),
			})
		),
		defaultValues: {
			name: tenant?.name ?? "",
			description: tenant?.description ?? "",
			periodLength: tenant?.periodLength ?? 14,
			startDate:
				weeekdays[
					DateTime.fromJSDate(tenant?.startDate ?? new Date()).weekday - 1
				]!,
			fields:
				tenant?.tenantActivefields.map((activeField) => activeField.field.id) ??
				[],
		},
	});

	const onClick = handleSubmit(async (values) => {
		let date = DateTime.now();
		while (date.weekday !== parseInt(values.startDate.id)) {
			date = date.minus({ days: 1 });
		}
		const startDate = date.startOf("day").toUTC().startOf("day").toJSDate();

		await update({
			name: values.name,
			description: values.description,
			periodLength: values.periodLength,
			startDate,
			isActive: true,
			logo: "",
			id: tenant?.id ?? "-1",
			tenantActiveFields: values.fields,
		});
	});

	const update = trpc.useMutation(["tenant.update"]).mutateAsync;

	return (
		<div className="w-full h-full flex flex-col">
			{!tenantLoading ? (
				<div className="">
					{/* <Formik
						validateOnBlur
						initialValues={{
							name: tenant?.name ?? "",
							description: tenant?.description ?? "",
							periodLength: tenant?.periodLength ?? 14,
							startDate:
								weeekdays[
									DateTime.fromJSDate(tenant?.startDate ?? new Date()).weekday -
										1
								]!,
							fields:
								tenant?.tenantActivefields.map(
									(activeField) => activeField.field.id
								) ?? [],
						}}
						onSubmit={async (
							values: tenantInfo,
							{ setSubmitting, setStatus }: FormikHelpers<tenantInfo>
						) => {

						

							setStatus("complete");
							setSubmitting(false);
						}}
					> */}
					{/* {({ isValid, dirty, isSubmitting, status }) => (
							<Form className="p-3 flex flex-col space-y-2"> */}
					<div className="flex">
						<div className="w-full px-3">
							<Section title="Tenant Details">
								<div className="flex flex-col w-full">
									<TextInput
										label="Team Name"
										name="name"
										placeholder="Sith Lords"
										control={control}
									/>
								</div>
							</Section>
							<Section>
								<div className="flex flex-col w-full">
									<TextInput
										control={control}
										label="Description"
										name="description"
										placeholder="Roger roger!"
									/>
								</div>
							</Section>
							<Section title="Configuration">
								<div className="flex flex-col">
									<TextInput
										control={control}
										label="Period Length"
										name="periodLength"
										placeholder="14"
									/>
								</div>
								<div className="flex flex-col w-48">
									<SelectInput
										control={control}
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
									disabled={!isValid || !isDirty || isSubmitting}
									className="btn btn-primary"
									onClick={onClick}
								>
									Submit
								</button>
							</div>
						</div>
						<div className="w-full px-3">
							<Section title="Default Fields">
								<div className="flex flex-col w-full space-y-2 py-2 overflow-y-scroll">
									Default columns for your timesheet. These are applied when you
									first visit a new sheet or on sheet reset.
									<MultiSelectList
										control={control}
										name="fields"
										label="Timesheet Fields"
										placeholder="Select Fields"
										elements={fields ?? []}
									/>
								</div>
							</Section>
						</div>
					</div>
					{/* </Form>
						)}
					</Formik> */}
				</div>
			) : (
				<Loading />
			)}
		</div>
	);
};

export default Settings;
