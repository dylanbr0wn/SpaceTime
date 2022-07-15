import {
	SortAscendingIcon,
	SortDescendingIcon,
	ViewListIcon,
} from "@heroicons/react/outline";

const Sorting = ({ isSorted }: { isSorted: string }) => {
	return (
		<div className="text-accent">
			{{
				asc: <SortAscendingIcon className="h-4 w-4" />,
				desc: <SortDescendingIcon className="h-4 w-4" />,
			}[isSorted] ?? <ViewListIcon className="h-4 w-4" />}
		</div>
	);
};
export default Sorting;
