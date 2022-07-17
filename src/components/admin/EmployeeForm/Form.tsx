import cuid from "cuid";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User } from "../../../utils/types/zod";

import ErrorBoundary from "../../common/ErrorBoundary";
import CheckBox from "../../common/form/CheckBox";
import Section from "../../common/form/Section";
import SelectInput from "../../common/form/SelectInput";
import TextInput from "../../common/form/TextInput";

import Success from "./Success";

const notify = (error: string) => toast.error(error);

// type formUser = Omit<Omit<Partial<User>, "department">, "manager"> & {
//     tenantId: string;
//     department: Partial<Department>;
//     manager: Partial<User>;
// };

const UserForm = ({ currentUser }: { currentUser: User | undefined }) => {
	const {
		control,
		formState: { isValid },
	} = useForm<User>({
		defaultValues: {
			...currentUser,
		},
	});

	return (
		<ErrorBoundary>
			{false ? (
				<div>yay</div>
			) : (
				<>
					<Section title="Details">
						<div className="flex flex-col w-full">
							<TextInput
								label="Name"
								name="name"
								placeholder="Anakin Skywalker"
								control={control}
							/>
						</div>
						<div className="flex flex-col w-full">
							<TextInput
								control={control}
								label="Email"
								name="email"
								placeholder="ani66@sith.ca"
							/>
						</div>
					</Section>
					<Section>
						<div className="flex flex-col w-full">
							<TextInput
								control={control}
								label="Code"
								name="code"
								placeholder="ANI66"
							/>
						</div>
					</Section>
					<Section>
						{/* <div className="flex flex-col w-full">
							<SelectInput
								validate={validateDepartment}
								placeholder="Sith Lord"
								name="department"
								label="Department"
								elements={data?.departments ?? []}
							/>
						</div> */}
						{/* <div className="flex flex-col w-full">
							<SelectInput
								control={control}
								placeholder="Darth Plagueis"
								name="managerId"
								label="Manager"
								elements={managersData?.managers ?? []}
							/>
						</div> */}
					</Section>

					<Section title="Status">
						<div className="flex flex-col w-full mt-2">
							<CheckBox
								name="isActive"
								control={control}
								label="Is an active user"
							/>
						</div>
					</Section>
					<Section title="Permissions">
						<div className="flex flex-col w-full mt-2">
							<CheckBox
								name="isAdmin"
								control={control}
								label="Administrator?"
							/>
						</div>

						<div className="flex flex-col w-full mt-2">
							<CheckBox name="isManager" control={control} label="Manager?" />
						</div>
						<div className="flex flex-col w-full mt-2">
							<CheckBox
								name="isPaymentManager"
								control={control}
								label="Payment Manager?"
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
		</ErrorBoundary>
	);
};

export default UserForm;
