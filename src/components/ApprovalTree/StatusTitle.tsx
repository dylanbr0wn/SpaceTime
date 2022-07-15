import * as React from "react";
import {
	StatusType,
	Status,
	EventTypeType,
	EventType,
} from "../../utils/types/zod";

const StatusTitle = ({
	type,
	status,
	name,
}: {
	type: EventTypeType;
	status: StatusType;
	name: string | undefined | null;
}) => {
	const [action, setAction] = React.useState("");
	const [close, setClose] = React.useState("");
	const [style, setStyle] = React.useState("");

	React.useEffect(() => {
		if (type === EventType.StatusChange) {
			if (status === Status.Submitted) {
				setAction("submitted");
				setStyle("text-warning");
				setClose("their timesheet for approval.");
			}
			if (status === Status.Rejected) {
				setAction("rejected");
				setStyle("text-error");
				setClose("the timesheet.");
			}
			if (status === Status.ManagerApproved) {
				setAction("approved");
				setStyle("text-success");
				setClose("the timesheet.");
			}
			if (status === Status.PaymentApproved) {
				setAction("approved");
				setStyle("text-secondary");
				setClose("the timesheet for payroll.");
			}
		} else {
			setAction("added a comment.");
			setStyle("text-base-content");
			setClose("");
		}
	}, [type, status]);

	return (
		<>
			{name} <span className={style}>{action}</span> {close}
		</>
	);
};

export default StatusTitle;
