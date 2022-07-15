import cuid from "cuid";
import _ from "lodash";
import * as React from "react";
import toast, { ErrorIcon } from "react-hot-toast";

// import {
//     Reference,
//     useMutation,
//     useQuery,
//     useReactiveVar,
// } from "@apollo/client";
// import Tooltip from "../../Tooltip";
import { Listbox, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import { animated } from "@react-spring/web";
import ErrorBoundary from "../../common/ErrorBoundary";
// import { TimeEntryRow } from "../types";

import FieldInputOption from "./FieldOption";
import { useOption, useFieldOptions, useShaker } from "./hooks";
import { FieldOption, TimeEntryRow } from "../../../utils/types/zod";
import { trpc } from "../../../utils/trpc";
import { useStore } from "../../../utils/store";
import { flushSync } from "react-dom";
import shallow from "zustand/shallow";

const notify = (error: string) =>
	toast.custom((t) => (
		<div
			className={`bg-base-300 text-base-content px-6 py-4 shadow-md rounded-full flex ${
				t.visible ? "animate-enter" : "animate-leave"
			}`}
		>
			<div className="pr-3">
				<ErrorIcon />
			</div>
			<div>{error}</div>
		</div>
	));

interface FieldInputProps {
	rowId: string | undefined;
	fieldId: string;
	userId: string;
	timesheetId: string;
	tenantId: string;
	fieldName: string;
	maxOptions: number;
}

/**
 * @name TimesheetDepartmentInput
 * @component
 * @category Time Entry
 * @description Input for Department.
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */
const FieldInput = ({
	rowId,
	fieldId,
	timesheetId,
	fieldName,
	maxOptions,
}: FieldInputProps) => {
	const [field, setField] = React.useState<FieldOption | null>(null);

	const { fieldInfo } = useFieldOptions(fieldId);

	const { usedRows, setUsedRows, setIsChanged, isChanged } = useStore(
		(state) => ({
			usedRows: state.usedRows,
			setUsedRows: state.setUsedRows,
			setIsChanged: state.setIsChanged,
			isChanged: state.IsChanged,
		}),
		shallow
	);

	const { setShake, shake, styles, setShaker } = useShaker(rowId, field);

	const utils = trpc.useContext();

	const updateEntryRowOption = trpc.useMutation(["entryRowOption.update"], {
		onMutate: async (newRowOption) => {
			await utils.cancelQuery([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);

			const previousRowOption = utils.getQueryData([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);

			const newTimeEntryRow = {
				...previousRowOption!,
				entryRowOptions: previousRowOption!.entryRowOptions.map((option) =>
					option.fieldId === newRowOption.fieldId
						? {
								...option,
								...newRowOption,
								fieldOption: field!,
						  }
						: option
				),
			};

			utils.setQueryData(
				[
					"timeEntryRow.read",
					{
						id: rowId ?? "-1",
					},
				],
				newTimeEntryRow
			);

			await utils.cancelQuery([
				"timeEntryRow.readAll",
				{
					timesheetId: timesheetId ?? "-1",
				},
			]);

			const previousRows = utils.getQueryData([
				"timeEntryRow.readAll",
				{
					timesheetId: timesheetId ?? "-1",
				},
			]);
			const newRows = previousRows?.map((r) =>
				r.id === rowId ? newTimeEntryRow : r
			);

			utils.setQueryData(
				[
					"timeEntryRow.readAll",
					{
						timesheetId: timesheetId ?? "-1",
					},
				],
				newRows!
			);

			// Return a context with the previous and new todo
			return { previousRowOption, newTimeEntryRow };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, newEntry, context) => {
			console.log("here", err);
			if (!context?.previousRowOption)
				utils.refetchQueries([
					"timeEntryRow.read",
					{
						id: rowId ?? "-1",
					},
				]);
			else {
				utils.setQueryData(
					[
						"timeEntryRow.read",
						{
							id: rowId ?? "-1",
						},
					],
					context.previousRowOption
				);
			}
		},
	});

	const updateTimesheet = trpc.useMutation(["timesheet.update"]).mutate;

	const onChange = (_field: FieldOption) => {
		/**
		 * TODO: This is a hack to get the field option to work.
		 * Need to figure out how to make sure user is not entering a value
		 * that could cause a collision.
		 *
		 * To check we construct a row with the new option and see if it exists
		 * in the existing rows. If it does, we don't allow the user to enter the
		 * value and we shake the field.
		 *
		 */

		setShake(false);
		if (_field.id === field?.id) return;
		if (!rowId) return;
		const thisRow = usedRows[rowId]?.filter((f) => f !== field?.id) ?? []; // Get row and remove the current field
		const newRow = [...thisRow, _field.id]; // Add the new field

		const result = Object.keys(usedRows).find(
			(r) =>
				_.isEmpty(_.xor(usedRows[r], newRow)) &&
				r !== rowId &&
				usedRows[r]?.length === maxOptions
		); // Check if the new row is a duplicate

		if (result) {
			notify("You cannot select the same option twice.");
			setShaker([result, _field.id]); // Shake the field
			return;
		}

		flushSync(() => {
			// Flush the state update so we know its available in the mutation onMutate
			setUsedRows({
				...usedRows,
				[rowId ?? "-1"]: newRow,
			});
			setField(_field);
		});

		// console.log(usedRows);

		updateEntryRowOption.mutate({
			//mutate the row
			fieldId,
			rowId: rowId ?? "-1",
			fieldOptionId: _field.id,
		});

		// set timesheet to be changed if it is not already
		if (!isChanged) {
			updateTimesheet({
				id: timesheetId ?? "-1",
				isChanged: true,
			});

			setIsChanged(true);
		}
	};

	const { option } = useOption(fieldId, rowId);

	// If the initialValue is changed external, sync it up with our state
	React.useEffect(() => {
		if (fieldInfo) {
			const field = fieldInfo.fieldOptions.find((dep) => dep.id === option?.id);
			setField((field as FieldOption) ?? null);
		}
	}, [option?.id, fieldInfo]);

	return (
		<>
			<ErrorBoundary>
				{fieldInfo && (
					<Listbox
						aria-label={`${fieldName} Input`}
						value={field}
						onChange={onChange}
						// onBlur={onBlur}
						disabled={false}
					>
						{({ open }) => (
							<animated.div style={styles} className={`w-full relative`}>
								<Listbox.Button
									className={`relative text-xs 2xl:text-sm outline outline-offset-2 w-full text-base-content h-10 py-2 pl-3 pr-10 border border-base-content/20 text-left rounded-lg
                                    transition-colors duration-150 ease-in-out ${
																			shake && "bg-error"
																		}
                                     focus:outline-none focus-visible:ring-2 bg-base-300
                                   ${
																			open
																				? "outline-base-content/20"
																				: "outline-transparent "
																		} sm:text-sm cursor-pointer `}
								>
									{field?.name ?? (
										<span className={`block truncate text-base-content/50`}>
											Choose a {fieldName.toLowerCase()}
											...
										</span>
									)}
									<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
										<SelectorIcon
											className="w-5 h-5 text-base-content"
											aria-hidden="true"
										/>
									</span>
								</Listbox.Button>
								<Transition
									as={React.Fragment}
									leave="transition ease-in duration-100"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<Listbox.Options className="absolute z-10 w-full p-1 mt-1.5 overflow-auto text-base bg-base-300 border border-base-content/20 rounded-lg shadow-xl shadow-black/40 max-h-60 focus:outline-none sm:text-sm">
										{fieldInfo.fieldOptions.map((option) => (
											<FieldInputOption key={option.id} option={option} />
										))}
									</Listbox.Options>
								</Transition>
							</animated.div>
						)}
					</Listbox>
				)}
			</ErrorBoundary>
		</>
	);
};

export default FieldInput;
