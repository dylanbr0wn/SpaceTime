import * as React from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { TimeEntry } from "../../../utils/types/zod";

export const useTimeEntry = (
	rowId: string | undefined,
	index: number,
	rowOptionslength: number
) => {

	const utils = trpc.useContext()

	const updateTimeEntryhoursMutation = trpc.useMutation(
		["timeEntry.update"], {
		// When mutate is called:
		onMutate: async newEntry => {

			const newTimeEntry = {
				...newEntry,
				id: "",
				createdAt: new Date(),
				updatedAt: new Date(),
				entryComments: []
			}

			await utils.cancelQuery(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			// await utils.cancelQueries(['todos', newTodo.id])

			// Snapshot the previous value
			const previousTodo = utils.getQueryData(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])

			// Optimistically update to the new value
			utils.setQueryData(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}], { ...previousTodo!, hours: newEntry.hours, id: newEntry.id })

			// Return a context with the previous and new todo
			return { previousTodo, newTimeEntry }
		},
		// If the mutation fails, use the context we returned above
		onError: (err, newEntry, context) => {

			if (!context?.previousTodo) utils.refetchQueries(['timeEntry.read'])
			else {
				utils.setQueryData(
					['timeEntry.read', {
						timeEntryRowId: rowId ?? "",
						index: index,
					}],
					context.previousTodo
				)
			}
		},
		// Always refetch after error or success:
		onSettled: newTodo => {
			utils.invalidateQueries(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])
		},
	}
	);
	const createTimeEntryMutation = trpc.useMutation(["timeEntry.create"], {
		// When mutate is called:
		onMutate: async newEntry => {

			const newTimeEntry = {
				...newEntry,
				id: "",
				createdAt: new Date(),
				updatedAt: new Date(),
				entryComments: []
			}

			await utils.cancelQuery(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			// await utils.cancelQueries(['todos', newTodo.id])

			// Snapshot the previous value
			const previousTodo = utils.getQueryData(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])

			// Optimistically update to the new value
			utils.setQueryData(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}], newTimeEntry)

			// Return a context with the previous and new todo
			return { previousTodo, newTimeEntry }
		},
		// If the mutation fails, use the context we returned above
		onError: (err, newEntry, context) => {

			if (!context?.previousTodo) utils.refetchQueries(['timeEntry.read'])
			else {
				utils.setQueryData(
					['timeEntry.read', {
						timeEntryRowId: rowId ?? "",
						index: index,
					}],
					context.previousTodo
				)
			}


		},
		// Always refetch after error or success:
		onSettled: newTodo => {
			utils.invalidateQueries(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])
		},
	});
	const deleteTimeEntryMutation = trpc.useMutation(["timeEntry.delete"], {
		onMutate: async newEntry => {

			await utils.cancelQuery(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			// await utils.cancelQueries(['todos', newTodo.id])

			// Snapshot the previous value
			const previousTodo = utils.getQueryData(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])

			// Optimistically update to the new value
			utils.setQueryData(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}], null)

			// Return a context with the previous and new todo
			return { previousTodo, newTimeEntry: null }
		},
		// If the mutation fails, use the context we returned above
		onError: (err, newEntry, context) => {
			if (!context?.previousTodo) utils.refetchQueries(['timeEntry.read'])
			else {
				utils.setQueryData(
					['timeEntry.read', {
						timeEntryRowId: rowId ?? "",
						index: index,
					}],
					context.previousTodo
				)
			}


		},
		onSettled: newTodo => {
			utils.invalidateQueries(['timeEntry.read', {
				timeEntryRowId: rowId ?? "",
				index: index,
			}])
		},
	}

	);


	const { register, handleSubmit, reset, getValues, setValue, formState: { isDirty } } = useForm<{ hours: string }>({
		defaultValues: { hours: '' },
		mode: "onChange",
	})

	const { data: timeEntryData } = trpc.useQuery(["timeEntry.read", {
		timeEntryRowId: rowId ?? "-1",
		index,
	}], {
		placeholderData: {
			timeEntryRowId: rowId ?? "-1",
			id: undefined,
			date: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			index,
			hours: 0,
			entryComments: [],
		},
		onSuccess(data) {
			if (!reset) return
			reset({ hours: data?.hours ? `${data.hours}` : '' })
		},
		refetchOnWindowFocus: false,
		enabled: rowOptionslength >= 3, // skip if there are no fields... cant have a time entry without fields
	});

	return { timeEntry: timeEntryData, isDirty, register, handleSubmit, hours: Number(getValues('hours')), reset, create: createTimeEntryMutation.mutate, update: updateTimeEntryhoursMutation.mutate, deleteMutate: deleteTimeEntryMutation.mutate };
};
