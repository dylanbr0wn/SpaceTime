import * as React from "react";

import { trpc } from "../../../utils/trpc";

export const useRowHasHours = (rowId: string | undefined) => {
    const [hasHours, setHasHours] = React.useState(false);
    const { data } = trpc.useQuery(["timeEntry.readAllInRow", {
        rowId: rowId ?? "-1",
    }], {

        enabled: !!rowId,
    });

    React.useEffect(() => {
        if (rowId && data) {
            const hasHours = data.length > 0;
            setHasHours(hasHours);
        }
    }, [rowId, data]);

    return { hasHours };
};
