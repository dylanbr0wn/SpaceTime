import * as React from "react";
import { trpc } from "../../../utils/trpc";
import { TimeEntry } from "../../../utils/types/zod";

export const useTimeEntry = (
    rowId: string | undefined,
    index: number,
    rowOptionslength: number
) => {
    const [needsToSave, setNeedsToSave] = React.useState(false);
    const [timeEntry, setTimeEntry] = React.useState<
        (TimeEntry & {
            entryComments: {
                id: string;
            }[];
        })
    >({
        timeEntryRowId: rowId ?? "-1",
        id: "-1",
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        index,
        hours: 0,
        entryComments: [],
    });
    const { data: timeEntryData } = trpc.useQuery(["timeEntry.read", {
        timeEntryRowId: rowId ?? "-1",
        index,
    }], {
        refetchOnWindowFocus: false,
        enabled: rowOptionslength >= 3, // skip if there are no fields... cant have a time entry without fields
    });

    React.useEffect(() => {
        if (timeEntryData) {
            setTimeEntry(timeEntryData);
        } else {
            setTimeEntry({
                timeEntryRowId: rowId ?? "-1",
                id: "-1",
                date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                index,
                hours: 0,
                entryComments: [],
            });
        }
    }, [index, timeEntryData]);

    React.useEffect(() => {
        setNeedsToSave(timeEntryData?.hours !== timeEntry?.hours);
    }, [timeEntryData, timeEntry]);

    return { timeEntry, setTimeEntry, needsToSave };
};
