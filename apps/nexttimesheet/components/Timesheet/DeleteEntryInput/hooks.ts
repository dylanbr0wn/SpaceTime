import * as React from "react";

import { useQuery } from "@apollo/client";

import { TimeEntriesDocument } from "../../../lib/apollo";

export const useRowHasHours = (rowId: string | undefined) => {
    const [hasHours, setHasHours] = React.useState(false);
    const { data } = useQuery(TimeEntriesDocument, {
        variables: {
            id: rowId ?? "-1",
        },
        skip: !rowId,
    });

    React.useEffect(() => {
        if (rowId && data?.timeEntryRow) {
            const hasHours = data.timeEntryRow.timeEntries.length > 0;
            setHasHours(hasHours);
        }
    }, [rowId, data]);

    return { hasHours };
};
