import cuid from "cuid";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import * as React from "react";

import { ExclamationIcon } from "@heroicons/react/solid";

import ErrorBoundary from "../../common/ErrorBoundary";
import CustModal from "../../common/Modal";
import { EventType, Status, zStatus } from "../../../utils/types/zod";
import { z, ZodEnum } from "zod";
import { trpc } from "../../../utils/trpc";
import { useStore } from "../../../utils/store";

/**
 * @name ApprovalStatus
 * @component
 * @category Time Entry
 * @description Approval Status display above the Timesheet.
 * @param {Object} props Props. See propTypes for details.
 */
const StatusBlock = ({
	status,
	timesheetId,
	timesheetChanged,
	userId,
}: {
	status: z.infer<typeof zStatus>;
	timesheetId: string;
	timesheetChanged: boolean;
	userId: string;
}) => {
	const [showModal, setShowModal] = React.useState(false);
	const [currentTimesheet, setCurrentTimesheet] = React.useState<
		string | undefined
	>();

	const setIsChanged = useStore((state) => state.setIsChanged);

	const { data: sessionData } = useSession();
	// const [hasChanged, setHasChanged] = React.useState(false);

	const isChanged = true;

	const mutation = trpc.useMutation("timesheet.update");

	React.useEffect(() => {
		if (!timesheetChanged && isChanged && currentTimesheet) {
			mutation.mutate({
				id: currentTimesheet,
				isChanged: isChanged,
			});
		}
	}, [isChanged, timesheetChanged, currentTimesheet, mutation]);

	React.useEffect(() => {
		if (
			timesheetId !== "-1" &&
			timesheetId &&
			currentTimesheet !== timesheetId
		) {
			setCurrentTimesheet(timesheetId);
		}
	}, [timesheetId, currentTimesheet]);

	const [comment, setComment] = React.useState("");

	const createStatusEventMutation = trpc.useMutation("statusEvents.create");

	const submit = () => {
		setIsChanged(false);
		createStatusEventMutation.mutate({
			status: Status.Submitted,
			message: comment,
			userId: String(userId),
			type: EventType.StatusChange,
			timesheetId,

			// optimisticResponse: {
			//     createStatusEvent: {
			//         __typename: "StatusEvent",
			//         id: cuid(),
			//         createdAt: DateTime.now().toISO(),
			//         message: comment,
			//         type: EventType.StatusChange,
			//         user: {
			//             __typename: "User",
			//             name: sessionData?.user?.name,
			//             avatar: sessionData?.user?.image,
			//         },
			//         status: Status.Submitted,
			//     },
			// },
			// update: (cache, { data }) => {
			//     cache.updateQuery(
			//         {
			//             query: StatusEventsDocument,
			//             variables: {
			//                 timesheetId,
			//             },
			//         },
			//         (newData) => {
			//             if (!data?.createStatusEvent) return newData;
			//             return {
			//                 statusEvents: [
			//                     ...(newData?.statusEvents ?? []),
			//                     data?.createStatusEvent,
			//                 ],
			//             };
			//         }
			//     );
			//     cache.modify({
			//         id: cache.identify({
			//             __typename: "Timesheet",
			//             id: timesheetId,
			//         }),
			//         fields: {
			//             isChanged: () => false,
			//             status: () => Status.Submitted,
			//         },
			//     });
			// },
		});
		setComment("");
		setShowModal(false);
	};

	return (
		<>
			<ErrorBoundary>
				<div className="flex flex-col my-auto">
					<div className="flex mb-3">
						<div className="my-auto">Status:</div>
						<h2
							className={` mx-3 font-bold text-lg ${
								status === Status.Submitted
									? "text-warning"
									: status === Status.ManagerApproved
									? "text-success"
									: status === Status.PaymentApproved
									? "text-secondary"
									: status === Status.Rejected
									? "text-error"
									: ""
							}`}
						>
							{status}
						</h2>
					</div>
					<div className="flex relative">
						{isChanged && (
							<div className="absolute right-full mr-3 my-3 h-full">
								<div className="tooltip" data-tip="Submit to save your changes">
									<div className="flex text-warning animate-pulse">
										<div>Unsaved</div>
										<ExclamationIcon className="h-6 w-6 ml-2 " />{" "}
									</div>
								</div>
							</div>
						)}

						<button onClick={() => setShowModal(true)} className="btn w-full">
							{status === Status.Unsubmitted ? "Submit" : "Update"}
						</button>
					</div>
				</div>
				<CustModal
					title={`${
						status === Status.Unsubmitted ? "Submit" : "Update"
					} timesheet`}
					show={showModal}
					onHide={() => setShowModal(false)}
				>
					<div className="flex flex-col w-full p-3">
						<div className="mb-2">
							Update your timesheet submission with your changes.
						</div>
						<div className="my-3">
							<div className="form-control w-full">
								<label className="label">
									<span className="label-text text-base">Add a comment:</span>
								</label>
								<textarea
									className="textarea textarea-bordered w-full"
									placeholder="That's no moon. It's a space station. "
									onChange={(e) => setComment(e.target.value)}
									value={comment}
								/>
							</div>
						</div>
						<div className="flex mt-3">
							<button onClick={() => submit()} className="btn btn-primary">
								{status === Status.Unsubmitted ? "Submit" : "Update"}
							</button>
						</div>
					</div>
				</CustModal>
			</ErrorBoundary>
		</>
	);
};

export default StatusBlock;
