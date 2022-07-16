import * as React from "react";

import {
	ColumnDef,
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";

import Avatar from "../../common/Avatar";
import ErrorBoundary from "../../common/ErrorBoundary";
import Loading from "../../common/Loading";
import DefaultTable from "../../common/Table";
import { Tenant, User } from "../../../utils/types/zod";
import { trpc } from "../../../utils/trpc";

const UsersList = ({
	user,
}: {
	user:
		| (User & {
				tenant: Tenant | null;
		  })
		| undefined;
}) => {
	const {
		data: usersData,
		isFetching,
		error,
	} = trpc.useQuery(
		[
			"user.readAll",
			{
				tenantId: user?.tenant?.id ?? "-1",
			},
		],
		{
			refetchOnWindowFocus: false,
			enabled: !!user?.tenant?.id,
		}
	);
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	});

	const [sorting, setSorting] = React.useState<SortingState>([]);

	// Columns specifier for react tables
	const columns = React.useMemo<ColumnDef<User>[]>(
		() => [
			{
				id: "user",
				cell: (info) => (
					<div className="flex  justify-start py-2">
						<Avatar
							image={info?.row?.original?.avatar}
							name={info.row.original.name}
						/>
						<div className="ml-3 my-auto ">{info.row.original.name}</div>
					</div>
				),
				header: () => <div className="text-left mr-3 font-bold ">User</div>,
			},
			{
				id: "status",
				cell: (info) => (
					<div className=" py-2 ">
						{info.row.original.isSetup ? (
							info.row.original.isActive ? (
								<div className="badge badge-success">Active</div>
							) : (
								<div className="badge badge-error">Inactive</div>
							)
						) : (
							<div className="badge badge-warning">Pending Signup</div>
						)}
					</div>
				),

				header: () => <div className="text-left mr-3 font-bold ">Status</div>,
			},
		],
		[]
	);

	const instance = useReactTable({
		data: usersData ?? [],
		columns,
		state: {
			sorting,
			pagination,
		},
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});
	// Handles submit for employee modal. Dispatches redux action and api call with saveEmployee. Creates toast on completion.

	// Handles closing the modal. If no changes have been made will close without confirmation.

	return (
		<>
			<ErrorBoundary>
				<div className="mx-auto max-w-screen-xl mt-2">
					{/* <div className="flex  content-middle text-accent my-3">
                        <UsersIcon className="w-7 h-7 mx-2 my-1  " />
                        <div className=" text-xl w-full my-auto">Users</div>
                    </div> */}
					<div className="">
						{isFetching ? (
							<div className="mt-5">
								<Loading />
							</div>
						) : error ? (
							<div>
								Oops, these really arnt the droids you are looking for 🫤
							</div>
						) : (
							<DefaultTable instance={instance} />
						)}
					</div>
				</div>
			</ErrorBoundary>
		</>
	);
};

export default UsersList;
