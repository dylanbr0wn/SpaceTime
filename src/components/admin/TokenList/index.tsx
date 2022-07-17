import { DateTime } from "luxon";
import * as React from "react";

import {
	ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";

import Avatar from "../../common/Avatar";
import CopyField from "../../common/CopyField";
import Loading from "../../common/Loading";
import DefaultTable from "../../common/Table";
import { OneTimeToken } from "../../../utils/types/zod";
import { KeyIcon } from "@heroicons/react/outline";

const TokenList = ({
	tokens,
	tokensError,
	tokensLoading,
}: {
	tokens:
		| (OneTimeToken & {
				user: { id: string; name: string | null; avatar: string | null };
		  })[]
		| undefined;
	tokensLoading: boolean;
	tokensError: any;
}) => {
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	});

	const [sorting, setSorting] = React.useState<SortingState>([]);

	const columns = React.useMemo<
		ColumnDef<
			OneTimeToken & {
				user: { id: string; name: string | null; avatar: string | null };
			}
		>[]
	>(
		() => [
			{
				accessorKey: "user",
				cell: ({ row }) => (
					<div className="flex  justify-start py-2">
						<Avatar
							image={row.original.user.avatar}
							name={row.original.user.name}
						/>
						<div className="ml-3 my-auto ">{row.original.user.name}</div>
					</div>
				),
				header: () => <div className="text-left mr-3 font-bold ">User</div>,
			},
			{
				id: "id",
				cell: (info) => <CopyField value={info.getValue()} />,

				header: () => <div className="text-left mr-3 font-bold ">Token</div>,
			},
			{
				id: "created",
				cell: (info) => {
					let date = DateTime.fromJSDate(info.getValue() ?? new Date());

					return <div className=" py-2 ">{date.toFormat("dd/LL/yyyy")}</div>;
				},

				header: () => (
					<div className="text-left mr-3 font-bold ">Date Issued</div>
				),
			},
		],
		[]
	);

	const instance = useReactTable({
		data: tokens ?? [],
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

	return (
		<div className=" mx-auto max-w-screen-xl h-full py-4">
			<div className="h-full flex flex-col">
				<div className="flex  content-middle  my-3">
					<KeyIcon className="w-8 h-8 mx-2 my-1  " />
					<div className=" text-2xl font-semibold w-full my-auto">Tokens</div>
				</div>
				{tokensLoading ? (
					<div className="mt-5">
						<Loading />
					</div>
				) : tokensError ? (
					<div>Oops, these really arnt the droids you are looking for 🫤</div>
				) : (
					<DefaultTable instance={instance} />
				)}
			</div>
		</div>
	);
};
export default TokenList;
