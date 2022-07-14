import * as React from "react";

import { BackspaceIcon } from "@heroicons/react/outline";
import ErrorBoundary from "../../common/ErrorBoundary";
import CustModal from "../../common/Modal";

import { useRowHasHours } from "./hooks";
import { trpc } from "../../../utils/trpc";
import { useStore } from "../../../utils/store";

/**
 * @name DeleteEntryInput
 * @component
 * @category Time Entry
 * @description Delete button for rows. Provides an icon which can be clicked to delete a row.
 * @param {Object} props Props. See propTypes for details.
 */
const DeleteEntryInput = ({
	rowId,
	timesheetId,
}: {
	rowId: string | undefined;
	timesheetId: string | undefined;
}) => {
	const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
		React.useState(false);

	const { hasHours } = useRowHasHours(rowId);

	const utils = trpc.useContext();

	const deleteTimeEntryRowMutation = trpc.useMutation("timeEntryRow.delete", {
		onMutate: async (oldRow) => {
			await utils.cancelQuery([
				"timeEntryRow.readAll",
				{
					timesheetId: timesheetId ?? "-1",
				},
			]);
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			// await utils.cancelQueries(['todos', newTodo.id])

			// Snapshot the previous value
			const previousTodo = utils.getQueryData([
				"timeEntryRow.readAll",
				{
					timesheetId: timesheetId ?? "-1",
				},
			]);

			// Optimistically update to the new value
			utils.setQueryData(
				[
					"timeEntryRow.readAll",
					{
						timesheetId: timesheetId ?? "-1",
					},
				],
				previousTodo!.filter((todo) => todo.id !== oldRow.id)
			);

			// Return a context with the previous and new todo
			return { previousTodo, newTimeEntry: null };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, newEntry, context) => {
			if (!context?.previousTodo) utils.refetchQueries(["timeEntry.read"]);
			else {
				utils.setQueryData(
					[
						"timeEntryRow.readAll",
						{
							timesheetId: timesheetId ?? "-1",
						},
					],
					context.previousTodo
				);
			}
		},
		onSettled: (newTodo) => {
			utils.invalidateQueries([
				"timeEntryRow.readAll",
				{
					timesheetId: timesheetId ?? "-1",
				},
			]);
		},
	});

	// Will delete a row. Dispatches deleteTimeEntryRow api call and redux action.
	// Delete button sub component

	const setIsChanged = useStore((state) => state.setIsChanged);

	const deleteRow = async () => {
		deleteTimeEntryRowMutation.mutate({
			id: rowId ?? "-1",
		});
		setIsChanged(true);

		setShowDeleteConfirmModal(false);
	};

	const handleDeleteRow = () => {
		if (!hasHours) {
			deleteRow();
		} else {
			setShowDeleteConfirmModal(true);
		}
	};

	const renderLoader = () => <p></p>;

	return (
		<>
			<ErrorBoundary>
				<span>
					<button
						title="Delete row"
						aria-label="Delete row"
						className="btn btn-square btn-ghost btn-sm mt-1 group"
						type="button"
						// title="Clear timesheet row"
						disabled={false}
						onClick={handleDeleteRow}
					>
						<BackspaceIcon className="text-base-content h-6 w-6 m-auto group-hover:text-error transition-colors duration-200" />
					</button>
					<React.Suspense fallback={renderLoader()}>
						<CustModal
							title={`Delete Timesheet Row?`}
							show={showDeleteConfirmModal}
							onHide={() => {
								setShowDeleteConfirmModal(false);
							}}
						>
							<div className="flex flex-col w-full p-3">
								<div className="mb-2">
									There is currently time entered in this row, are you sure you
									want to delete it?
								</div>

								<div className="flex mt-3 space-x-3">
									<button
										onClick={() => {
											setShowDeleteConfirmModal(false);
										}}
										className="btn btn-error btn-outline"
									>
										Cancel
									</button>
									<button onClick={deleteRow} className="btn btn-primary">
										Delete
									</button>
								</div>
							</div>
						</CustModal>
					</React.Suspense>
				</span>
			</ErrorBoundary>
		</>
	);
};

export default DeleteEntryInput;
