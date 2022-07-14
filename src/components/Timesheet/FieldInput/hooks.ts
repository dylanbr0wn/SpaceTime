import * as React from "react";
import { useSpring } from "@react-spring/web";
import { useStore } from "../../../utils/store";
import { trpc } from "../../../utils/trpc";
import {
	Field,
	FieldOption,
	TimeEntry,
	TimeEntryRow,
} from "../../../utils/types/zod";
import shallow from "zustand/shallow";

export const useFieldOptions = (fieldId: string) => {
	const { data } = trpc.useQuery(
		[
			"field.read",
			{
				id: fieldId,
			},
		],
		{
			refetchOnWindowFocus: false,
		}
	);

	React.useEffect(() => {
		console.log("useFieldOptions", data);
		console.log(fieldId);
	}, [data, fieldId]);

	return { fieldInfo: data };
};

export const useShaker = (
	rowId: string | undefined,
	field: FieldOption | null
) => {
	const { shaker, setShaker } = useStore(
		(state) => ({
			shaker: state.shaker,
			setShaker: state.setShaker,
		}),
		shallow
	);
	const [shake, setShake] = React.useState(false);

	React.useEffect(() => {
		const animateOnOff = async () => {
			for (let i = 0; i < 2; i++) {
				setShake(true);
				await new Promise((resolve) => setTimeout(resolve, 150));
				setShake(false);
				await new Promise((resolve) => setTimeout(resolve, 150));
			}
		};
		if (!shaker) {
			return;
		}
		if (shaker[0] === rowId && shaker[1] === field?.id) {
			animateOnOff();
			const timeoutId = window.setTimeout(() => {
				setShaker(["", ""]);
			}, 150);
			return () => {
				window.clearTimeout(timeoutId);
			};
		}
	}, [shaker, rowId, field?.id]);

	const styles = useSpring({
		x: shaker[0] === rowId && shaker[1] === field?.id ? -5 : 0,
		config: {
			tension: 400,
			friction: 3,
			mass: 0.5,
		},
	});

	return { styles, shake, setShake, setShaker };
};

export const useOption = (fieldId: string, rowId: string | undefined) => {
	const { data } = trpc.useQuery(
		[
			"timeEntryRow.read",
			{
				id: rowId ?? "-1",
			},
		],
		{
			select: React.useCallback(
				(
					data:
						| (TimeEntryRow & {
								entryRowOptions: {
									fieldOption: {
										id: string;
									};
									fieldId: string;
									id: string;
								}[];
								timeEntries: (TimeEntry & {
									entryComments: {
										id: string;
									}[];
								})[];
						  })
						| undefined
				) => {
					return data?.entryRowOptions?.find(
						(option) => option.fieldId === fieldId
					)?.fieldOption;
				},
				[fieldId]
			),
			refetchOnWindowFocus: false,
		}
	);
	return { option: data };
};
