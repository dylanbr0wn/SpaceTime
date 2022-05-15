import * as React from "react";

import { useGetTimeEntriesQuery } from "../../../lib/apollo";

export const useRowHasHours = (rowId: string | undefined) => {
    const [hasHours, setHasHours] = React.useState(false);
    const { data } = useGetTimeEntriesQuery({
        variables: {
            rowId: rowId ?? "-1",
        },
        skip: !rowId,
    });

    React.useEffect(() => {
        if (rowId && data?.getTimeEntryRow) {
            const hasHours = data.getTimeEntryRow.timeEntries.length > 0;
            setHasHours(hasHours);
        }
    }, [rowId, data]);

    return { hasHours };
};
