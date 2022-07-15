import {
	ColumnDef,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import * as React from "react";
import { getDayFeatures } from "../../../lib/utils";
import { useStore } from "../../utils/store";

import { trpc } from "../../utils/trpc";
import { TimeEntryRow } from "../../utils/types/zod";

import DeleteEntryInput from "./DeleteEntryInput";
import EntryInput from "./EntryInput";
import FieldInput from "./FieldInput";

const defaultRow = {
	id: "-1",
	createdAt: new Date(),
	updatedAt: new Date(),
	rowOptions: [],
};

export const useTimesheetDates = (
	timesheetQueryDate: Date,
	authId: string | undefined
) => {
	const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);
	const [start, setStartDate] = React.useState<DateTime>();
	const [periodLength, setPeriodLength] = React.useState<number>();
	// const [timesheetId, setTimesheetId] = React.useState();

	const setIsChanged = useStore((state) => state.setIsChanged);

	const { data: timesheetData, isFetching: timesheetLoading } = trpc.useQuery(
		[
			"timesheet.readFromAuth",
			{
				authId: String(authId),
				date: timesheetQueryDate,
			},
		],
		{
			refetchOnWindowFocus: false,
			enabled: !!authId,
		}
	);

	React.useEffect(() => {
		setIsChanged(!!timesheetData?.isChanged);
	}, [timesheetData?.isChanged]);

	// Could probably simplify this sucker
	React.useEffect(() => {
		if (timesheetData?.period) {
			const endDate = timesheetData?.period?.endDate;
			const startDate = timesheetData?.period?.startDate;
			const dates: DateTime[] = [];
			const _end = DateTime.fromJSDate(endDate, { zone: "utc" });
			const _start = DateTime.fromJSDate(startDate, { zone: "utc" });

			setPeriodLength(_end.diff(_start, "days").days);
			setStartDate(_start);
			let current = _start;
			while (current < _end) {
				dates.push(current);
				current = current.plus({ days: 1 });
			}

			setTimesheetDates(dates);
		}
	}, [timesheetData?.period]);

	return {
		timesheetDates,
		startDate: start,
		periodLength,
		timesheetFromDate: timesheetData,
		timesheetLoading,
	};
};

export const useTimesheetColumns = (
	timesheet:
		| {
				timesheetFields: {
					field: {
						id: string;
						name: string;
					};
				}[];
		  }
		| undefined
) => {
	const [columns, setColumns] = React.useState<{ id: string; name: string }[]>(
		[]
	);

	React.useEffect(() => {
		if (timesheet) {
			setColumns(timesheet.timesheetFields.map((field) => field.field));
		}
	}, [timesheet]);

	return { columns };
};

export const useRows = (
	timesheetId: string | undefined,
	timesheetDates: DateTime[]
) => {
	const { setUsedRows, usedRows } = useStore((state) => ({
		setUsedRows: state.setUsedRows,
		usedRows: state.usedRows,
	}));

	const {
		data,
		isLoading: rowsLoading,
		// error,
	} = trpc.useQuery(
		["timeEntryRow.readAll", { timesheetId: timesheetId ?? "-1" }],
		{
			onError(err) {
				console.error(err);
			},
			onSuccess(data) {
				if (!data) return;
				if (Object.values(usedRows).length !== 0) return;
				const newUsedRows: { [key: string]: string[] } = {};
				data.forEach((row) => {
					newUsedRows[row.id] = row.entryRowOptions.map(
						(option) => option.fieldOption.id
					);
				});
				setUsedRows(newUsedRows);
			},
			enabled: !!timesheetId,
			refetchOnWindowFocus: false,
		}
	);

	// React.useEffect(() => {
	// 	if (data && !rowsLoading) {
	// 	}
	// }, [data, timesheetDates, rowsLoading]);

	return { rows: data, rowsLoading };
};
