import * as React from "react";

export const useRowHasHours = (row) => {
    const [hasHours, setHasHours] = React.useState(false);

    React.useEffect(() => {
        if (row) {
            const hasHours = row.timeEntries.some((entry) => entry.id !== "-1");
            setHasHours(hasHours);
        }
    }, [row]);

    return { hasHours };
};
