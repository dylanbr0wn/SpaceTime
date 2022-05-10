import Image from "next/image";
import * as React from "react";

import { KeyIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import {
    createTable,
    getCoreRowModelSync,
    useTableInstance,
} from "@tanstack/react-table";

import {
    GetOneTimeTokensQuery,
    OneTimeToken,
    useGetOneTimeTokensQuery,
    User,
} from "../../../lib/apollo";

const table =
    createTable().setRowType<
        Partial<Pick<OneTimeToken, "tenant" | "id" | "user" | "createdAt">>
    >();

const TokenList = ({ currentUser }: { currentUser: Partial<User> }) => {
    // const [page, setPage] = React.useState(1);
    const { data, error, loading } = useGetOneTimeTokensQuery({
        variables: {
            tenantId: currentUser.tenant?.id ?? "-1",
        },
    });

    const columns = React.useMemo(
        () => [
            table.createDataColumn("user", {
                cell: (info) => (
                    <div className="flex">
                        <div className="px-2 my-auto">{info?.value?.name}</div>
                        {info?.value?.avatar ? (
                            <div className="avatar">
                                <div className=" rounded-full w-12">
                                    <Image
                                        alt={info?.value?.name ?? ""}
                                        src={info?.value?.avatar ?? ""}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="avatar placeholder">
                                <div className="bg-slate-900 text-neutral-content rounded-full w-12">
                                    <span className="text-xl">
                                        {info?.value?.name?.charAt(0)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ),
            }),
            table.createDataColumn((row) => row.id, {
                id: "id",
                cell: (info) => info.value,
                header: () => <span>Token</span>,
            }),
        ],
        []
    );

    const instance = useTableInstance(table, {
        data: (data?.getOneTimeTokens as OneTimeToken[]) ?? [],
        columns,
        getCoreRowModel: getCoreRowModelSync(),
    });

    return (
        <div className=" mx-auto max-w-screen-xl">
            <div className="flex  content-middle text-yellow-500">
                <KeyIcon className="w-7 h-7 mx-2 my-1  " />
                <div className=" text-xl w-full my-auto">Tokens</div>
            </div>
            <div className="p-2">
                <table>
                    <thead>
                        {instance.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : header.renderHeader()}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {instance.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>{cell.renderCell()}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="h-4" />
            </div>
            <div></div>
        </div>
    );
};
export default TokenList;
