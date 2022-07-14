import * as React from "react";

import { trpc } from "../../../utils/trpc";

export const useRowHasHours = (rowId: string | undefined) => {
	const [hasHours, setHasHours] = React.useState(false);
	const { data } = trpc.useQuery(
		[
			"timeEntryRow.read",
			{
				id: rowId ?? "-1",
			},
		],
		{
			select: (data) => data.timeEntries,
			enabled: !!rowId,
			refetchOnWindowFocus: false,
		}
	);

	React.useEffect(() => {
		if (rowId && data) {
			const hasHours = data.length > 0;
			setHasHours(hasHours);
		}
	}, [rowId, data]);

	return { hasHours };
};
