// import * as React from "react";

// import { useQuery } from "@apollo/client";
// import { Row } from "@tanstack/react-table";

// import { WorkTypesDocument, WorkTypesQuery } from "../../../lib/apollo";
// import { MyTableGenerics } from "../Table";
// import { TimeEntryRow } from "../types";

// export const useWorkTypes = (
//     rows: Row<MyTableGenerics>[],
//     currentRow: TimeEntryRow | undefined,
//     tenantId: string
// ) => {
//     const [filteredWorkTypes, setFilteredWorkTypes] = React.useState<
//         WorkTypesQuery["workTypes"]
//     >([]);

//     const [disableWorkTypeSelect, setDisableWorkTypeSelect] =
//         React.useState(true);

//     const [allWorkTypesUsed, setAllWorkTypesUsed] = React.useState(false);

//     const { data } = useQuery(WorkTypesDocument, {
//         variables: {
//             tenantId,
//         },
//     });

//     React.useEffect(() => {
//         const currentWorkTypes: string[] = rows
//             .filter(
//                 (row) =>
//                     row?.original?.id !== currentRow?.id &&
//                     row?.original?.project?.id === currentRow?.project?.id
//             )

//             .map((row) => row?.original?.workType?.id ?? "");
//         const workTypes = data?.workTypes ?? [];

//         const filteredWorkTypes = workTypes.filter(
//             (workType) => !currentWorkTypes.includes(workType.id)
//         );
//         setFilteredWorkTypes(filteredWorkTypes);
//         if (filteredWorkTypes.length === 0 && workTypes.length > 0) {
//             setAllWorkTypesUsed(true);
//         }
//     }, [rows, data, currentRow]);

//     React.useEffect(() => {
//         if (
//             currentRow?.department &&
//             currentRow?.department?.id !== "-1" &&
//             currentRow?.project &&
//             currentRow?.project?.id !== "-1"
//         ) {
//             setDisableWorkTypeSelect(false);
//         }
//     }, [currentRow]);

//     return { filteredWorkTypes, disableWorkTypeSelect, allWorkTypesUsed };
// };
