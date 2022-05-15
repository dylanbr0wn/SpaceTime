import * as React from "react";

import {
    TimeEntryFromIndexQuery,
    useTimeEntryFromIndexQuery,
} from "../../../lib/apollo";

export const useTimeEntry = (rowId: string | undefined, index: number) => {
    const [isEditing, setIsEditing] = React.useState(false); // Is the input field active?
    const [isSaving, setIsSaving] = React.useState(false); // Keep track of saving state
    const [needsToSave, setNeedsToSave] = React.useState(false);
    const [timeEntry, setTimeEntry] = React.useState<
        TimeEntryFromIndexQuery["timeEntryFromIndex"]
    >({
        id: "-1",
        date: "",
        createdAt: "",
        updatedAt: "",
        index,
        hours: 0,
        entryComments: [],
    });
    const { data: timeEntryData } = useTimeEntryFromIndexQuery({
        variables: {
            timeEntryRowId: rowId ?? "-1",
            index,
        },
    });

    React.useEffect(() => {
        setIsSaving(false);
    }, [timeEntry]);

    React.useEffect(() => {
        if (timeEntryData?.timeEntryFromIndex) {
            setTimeEntry(timeEntryData?.timeEntryFromIndex);

            // }
        } else {
            setTimeEntry({
                id: "-1",
                date: "",
                createdAt: "",
                updatedAt: "",
                index,
                hours: 0,
                entryComments: [],
            });
        }
    }, [index, timeEntryData]);

    React.useEffect(() => {
        setNeedsToSave(
            timeEntryData?.timeEntryFromIndex?.hours !== timeEntry?.hours
        );
    }, [timeEntryData, timeEntry]);

    return { timeEntry, setTimeEntry, needsToSave, setIsSaving, setIsEditing };
};
