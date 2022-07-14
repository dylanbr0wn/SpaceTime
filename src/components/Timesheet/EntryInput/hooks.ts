import * as React from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { TimeEntry, TimeEntryRow } from "../../../utils/types/zod";

const useEntry = (
	rowId: string | undefined,
	enabled: boolean,
	index: number
) => {
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
				) => data?.timeEntries.find((entry) => entry.index === index),
				[index]
			),
			// onSuccess(data) {
			//
			// },
			refetchOnWindowFocus: false,
			enabled, // skip if there are no fields... cant have a time entry without fields
		}
	);
	return { entry: data };
};

export const useTimeEntry = (
	rowId: string | undefined,
	index: number,
	rowOptionslength: number
) => {
	const utils = trpc.useContext();

	const updateTimeEntryhoursMutation = trpc.useMutation(["timeEntry.update"], {
		context: {
			skipBatch: true,
		},
		// When mutate is called:
		onMutate: async (newEntry) => {
			const newTimeEntry = {
				...newEntry,
				id: "",
				createdAt: new Date(),
				updatedAt: new Date(),
				entryComments: [],
			};

			await utils.cancelQuery([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			// await utils.cancelQueries(['todos', newTodo.id])

			// Snapshot the previous value
			const previousRow = utils.getQueryData([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);

			// Optimistically update to the new value
			utils.setQueryData(
				[
					"timeEntryRow.read",
					{
						id: rowId ?? "-1",
					},
				],
				{
					...previousRow!,
					timeEntries: previousRow!.timeEntries.map((entry) =>
						entry.id === newTimeEntry.id
							? { ...entry, hours: newTimeEntry.hours }
							: entry
					),
				}
			);

			// Return a context with the previous and new todo
			return { previousRow, newTimeEntry };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, newEntry, context) => {
			console.error(err);
			if (!context?.previousRow)
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
					context.previousRow
				);
			}
		},
		// Always refetch after error or success:
		// onSettled: (newTodo) => {
		// 	utils.invalidateQueries(
		// 		[
		// 			"timeEntryRow.read",
		// 			{
		// 				id: rowId ?? "-1",
		// 			},
		// 		],
		// 		{
		// 			refetchActive: false,
		// 		}
		// 	);
		// },
	});
	const createTimeEntryMutation = trpc.useMutation(["timeEntry.create"], {
		context: {
			skipBatch: true,
		},
		// When mutate is called:
		onMutate: async (newEntry) => {
			const newTimeEntry = {
				...newEntry,
				id: "",
				createdAt: new Date(),
				updatedAt: new Date(),
				entryComments: [],
			};

			await utils.cancelQuery([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			// await utils.cancelQueries(['todos', newTodo.id])

			// Snapshot the previous value
			const previousRow = utils.getQueryData([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);

			// Optimistically update to the new value
			utils.setQueryData(
				[
					"timeEntryRow.read",
					{
						id: rowId ?? "-1",
					},
				],
				{
					...previousRow!,
					timeEntries: [...previousRow!.timeEntries, newTimeEntry],
				}
			);

			// Return a context with the previous and new todo
			return { previousRow, newTimeEntry };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, newEntry, context) => {
			console.error(err);
			if (!context?.previousRow)
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
					context.previousRow
				);
			}
		},
		// Always refetch after error or success:
		onSettled: (newTodo) => {
			utils.invalidateQueries([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);
		},
	});
	const deleteTimeEntryMutation = trpc.useMutation(["timeEntry.delete"], {
		context: {
			skipBatch: true,
		},
		onMutate: async (newEntry) => {
			await utils.cancelQuery([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			// await utils.cancelQueries(['todos', newTodo.id])

			// Snapshot the previous value
			const previousRow = utils.getQueryData([
				"timeEntryRow.read",
				{
					id: rowId ?? "-1",
				},
			]);

			// Optimistically update to the new value
			utils.setQueryData(
				[
					"timeEntryRow.read",
					{
						id: rowId ?? "-1",
					},
				],
				{
					...previousRow!,
					timeEntries: previousRow!.timeEntries.filter(
						(entry) => entry.id !== newEntry.id
					),
				}
			);

			// Return a context with the previous and new todo
			return { previousRow, newTimeEntry: null };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, newEntry, context) => {
			console.error(err);
			if (!context?.previousRow)
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
					context.previousRow
				);
			}
		},
		// onSettled: (newTodo) => {
		// 	utils.invalidateQueries(
		// 		[
		// 			"timeEntryRow.read",
		// 			{
		// 				id: rowId ?? "-1",
		// 			},
		// 		],
		// 		{
		// 			refetchActive: false,
		// 		}
		// 	);
		// },
	});

	const {
		register,
		handleSubmit,
		reset,
		getValues,
		setValue,
		formState: { isDirty, errors },
	} = useForm<{ hours: string }>({
		defaultValues: { hours: "" },
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const { entry } = useEntry(rowId, rowOptionslength >= 3, index);

	React.useEffect(() => {
		if (!reset) return;
		reset({ hours: entry?.hours ? `${entry.hours}` : "" });
	}, [entry?.hours]);

	// React.useEffect(() => {
	//   console.log(errors)
	// },[errors])

	return {
		timeEntry: entry,
		isDirty,
		register,
		handleSubmit,
		getValues,
		reset,
		create: createTimeEntryMutation.mutate,
		update: updateTimeEntryhoursMutation.mutate,
		deleteMutate: deleteTimeEntryMutation.mutate,
	};
};
