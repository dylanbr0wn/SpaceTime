import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";
import { useStore } from "../../../utils/store";
import { trpc } from "../../../utils/trpc";
import { TimeEntryRow } from "../../../utils/types/zod";
import ErrorBoundary from "../../common/ErrorBoundary";
import CustModal from "../../common/Modal";

import Comments from "./Comments";
import { useTimeEntry } from "./hooks";

interface IEntryInputProps {
	rowId: string | undefined;
	date: DateTime;
	index: number;
	userId: string;
	timesheetId: string;
}

/**
 * @name HourEntryInput
 * @component
 * @category Time Entry
 * @description Hour entry input. Provides a input field which takes a number.
 * @param {Object} props Props. See propTypes for details.
 */
const EntryInput = ({
	rowId,
	date,
	index,
	userId,
	timesheetId,
}: IEntryInputProps) => {
	const usedRow = useStore(
		React.useCallback((state) => state.getRow(rowId), [rowId])
	);

	const isChanged = useStore((state) => state.IsChanged);

	const setIsChanged = useStore((state) => state.setIsChanged);

	const disableEntryInput = (usedRow?.length ?? 0) < 3;

	const updateTimesheet = trpc.useMutation(["timesheet.update"]).mutate;

	const {
		timeEntry,
		isDirty,
		register,
		getValues,
		reset,
		create,
		deleteMutate,
		update,
		handleSubmit,
	} = useTimeEntry(rowId, index, usedRow?.length ?? 0);
	// We'll only update the external data when the input is blurred

	// when comment change detected, will wait 0.75s to update. If updated before end of 0.75s, timer will restart.

	const [isOpen, setIsOpen] = React.useState(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	const clickHandler = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (!timeEntry) return;

		if (event.ctrlKey || event.metaKey) setIsOpen(true);
	};

	return (
		<>
			<ErrorBoundary>
				<div className=" w-full h-10">
					<input
						aria-label="timesheetEntryInput"
						type="number"
						onClick={clickHandler}
						{...register("hours", {
							required: true,
							min: 0,
							max: 24,
							// valueAsNumber: true,
							disabled: false || disableEntryInput,

							onBlur: () => {
								const hours = Number(getValues("hours"));

								if (!timeEntry?.id && (hours ?? 0) > 0) {
									create({
										date: date.toJSDate(),
										index,
										hours: hours ?? 0,
										timeEntryRowId: rowId ?? "-1",
									});
									if (!isChanged) {
										updateTimesheet({
											id: timesheetId ?? "-1",
											isChanged: true,
										});

										setIsChanged(true);
									}
								} else if (timeEntry?.id && hours) {
									if (isDirty) {
										update({
											id: timeEntry?.id ?? "-1",
											hours: hours ?? 0,
										});
									}
									reset({ hours: `${hours}` });
									if (!isChanged) {
										updateTimesheet({
											id: timesheetId ?? "-1",
											isChanged: true,
										});

										setIsChanged(true);
									}
								} else if (timeEntry?.id && (isNaN(hours) || hours === 0)) {
									deleteMutate({
										id: timeEntry?.id ?? "-1",
									});
									if (!isChanged) {
										updateTimesheet({
											id: timesheetId ?? "-1",
											isChanged: true,
										});

										setIsChanged(true);
									}
								} else {
									reset({ hours: "" });
									// setIsSaving(false);
								}

								// setIsEditing(false);
							},
						})}
						// onFocus={() => setIsEditing(true)}
						className={`w-full h-full input input-bordered input-sm bg-base-300 px-1.5 2xl:px-2 text-xs 2xl:text-sm ${
							false || disableEntryInput ? "input-disabled" : ""
						} ${
							(timeEntry?.entryComments?.length ?? 0) > 0 ? "input-accent" : ""
						}`}
						step="0.01"
					/>
				</div>
				<CustModal onHide={closeModal} show={isOpen} title="Comments">
					<Comments
						timeEntryRowId={rowId ?? "-1"}
						timeEntryId={timeEntry?.id ?? "-1"}
						closeModal={closeModal}
						userId={userId}
						// onCommentChange={onCommentChange}
						comments={timeEntry?.entryComments ?? []}
					/>
				</CustModal>
			</ErrorBoundary>
		</>
	);
};

export default EntryInput;
