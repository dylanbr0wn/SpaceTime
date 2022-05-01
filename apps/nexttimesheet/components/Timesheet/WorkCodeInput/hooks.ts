import * as React from "react";
import { Row } from "react-table";
import { TimeEntryRow, useWorkTypesQuery, WorkType } from "../../../lib/apollo";

export const useWorkTypes = (
    rows: Row<Partial<TimeEntryRow>>[],
    currentRow: Row<Partial<TimeEntryRow>>
) => {
    const [filteredWorkTypes, setFilteredWorkTypes] = React.useState<
        WorkType[]
    >([]);

    const [disableWorkTypeSelect, setDisableWorkTypeSelect] =
        React.useState(true);

    const [allWorkTypesUsed, setAllWorkTypesUsed] = React.useState(false);

    const { data } = useWorkTypesQuery();

    React.useEffect(() => {
        const currentWorkTypes: string[] = rows
            .filter(
                (row) =>
                    row.index !== currentRow.index &&
                    row?.original?.project?.id ===
                        currentRow?.original?.project?.id
            )

            .map((row) => row?.original?.workType?.id ?? "");
        const workTypes = data?.workTypes ?? [];

        const filteredWorkTypes = workTypes.filter(
            (workType) => !currentWorkTypes.includes(workType.id)
        );
        setFilteredWorkTypes(filteredWorkTypes);
        if (filteredWorkTypes.length === 0 && workTypes.length > 0) {
            setAllWorkTypesUsed(true);
        }
    }, [rows, data, currentRow]);

    React.useEffect(() => {
        if (
            currentRow.original.department &&
            currentRow?.original?.department?.id !== "-1" &&
            currentRow?.original?.project &&
            currentRow?.original?.project?.id !== "-1"
        ) {
            setDisableWorkTypeSelect(false);
        }
    }, [currentRow]);

    return { filteredWorkTypes, disableWorkTypeSelect, allWorkTypesUsed };
};
