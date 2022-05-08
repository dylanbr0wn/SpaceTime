import * as React from "react";

import { Row } from "@tanstack/react-table";

import { TimeEntryRow, useWorkTypesQuery, WorkType } from "../../../lib/apollo";
import { MyTableGenerics } from "../Table";

export const useWorkTypes = (
    rows: Row<MyTableGenerics>[],
    currentRow: Partial<TimeEntryRow> | undefined
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
                    row?.original?.id !== currentRow?.id &&
                    row?.original?.project?.id === currentRow?.project?.id
            )

            .map((row) => row?.original?.workType?.id ?? "");
        // console.log(currentWorkTypes);
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
            currentRow?.department &&
            currentRow?.department?.id !== "-1" &&
            currentRow?.project &&
            currentRow?.project?.id !== "-1"
        ) {
            setDisableWorkTypeSelect(false);
        }
    }, [currentRow]);

    return { filteredWorkTypes, disableWorkTypeSelect, allWorkTypesUsed };
};
