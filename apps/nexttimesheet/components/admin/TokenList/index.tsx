import { DateTime } from "luxon";
import * as React from "react";

import { useQuery } from "@apollo/client";
import {
    createTable,
    getCoreRowModelSync,
    getPaginationRowModel,
    getSortedRowModelSync,
    PaginationState,
    SortingState,
    useTableInstance,
} from "@tanstack/react-table";

import { OneTimeToken, OneTimeTokensDocument, User } from "../../../lib/apollo";
import Avatar from "../../common/Avatar";
import CopyField from "../../common/CopyField";
import Loading from "../../common/Loading";
import DefaultTable from "../../common/Table";

const table =
    createTable().setRowType<
        Partial<Pick<OneTimeToken, "tenant" | "id" | "user" | "createdAt">>
    >();

const TokenList = ({ currentUser }: { currentUser: Partial<User> }) => {
    const { data, error, loading } = useQuery(OneTimeTokensDocument, {
        variables: {
            tenantId: currentUser.tenant?.id ?? "-1",
        },
    });

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
        pageCount: data?.oneTimeTokens.length ?? 0 / 5,
    });

    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns = React.useMemo(
        () => [
            table.createDataColumn("user", {
                cell: (info) => (
                    <div className="flex  justify-start py-2">
                        <Avatar
                            image={info?.value?.avatar}
                            name={info?.value?.name}
                        />
                        <div className="ml-3 my-auto ">{info?.value?.name}</div>
                    </div>
                ),
                header: () => (
                    <div className="text-left mr-3 font-bold ">User</div>
                ),
            }),
            table.createDataColumn((row) => row.id, {
                id: "id",
                cell: (info) => <CopyField value={info.value} />,

                header: () => (
                    <div className="text-left mr-3 font-bold ">Token</div>
                ),
            }),
            table.createDataColumn((row) => row.createdAt, {
                id: "created",
                cell: (info) => {
                    let date: DateTime;
                    if (typeof info.value === "string") {
                        date = DateTime.fromISO(info.value);
                    } else {
                        date = DateTime.fromJSDate(info?.value ?? new Date());
                    }

                    return (
                        <div className=" py-2 ">
                            {date.toFormat("dd/LL/yyyy")}
                        </div>
                    );
                },

                header: () => (
                    <div className="text-left mr-3 font-bold ">Date Issued</div>
                ),
            }),
        ],
        []
    );

    const instance = useTableInstance(table, {
        data: (data?.oneTimeTokens as OneTimeToken[]) ?? [],
        columns,
        state: {
            sorting,
            pagination,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModelSync(),
        getSortedRowModel: getSortedRowModelSync(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className=" mx-auto max-w-screen-xl mt-2">
            {/* <div className="flex  content-middle text-warning my-3">
                <KeyIcon className="w-7 h-7 mx-2 my-1  " />
                <div className=" text-xl w-full my-auto">Tokens</div>
            </div> */}
            <div className="">
                {loading ? (
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
    );
};
export default TokenList;
