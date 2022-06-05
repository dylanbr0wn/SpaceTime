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

import { User, UserFromAuthIdQuery, UsersDocument } from "../../../lib/apollo";
import Avatar from "../../common/Avatar";
import ErrorBoundary from "../../common/ErrorBoundary";
import Loading from "../../common/Loading";
import DefaultTable from "../../common/Table";

const table = createTable().setRowType<Partial<User>>();

const UsersList = ({
    user,
}: {
    user: UserFromAuthIdQuery["userFromAuthId"] | undefined;
}) => {
    const {
        data: usersData,
        loading,
        error,
    } = useQuery(UsersDocument, {
        variables: {
            tenantId: user?.tenant?.id ?? "-1",
        },
        skip: !user?.tenant?.id,
    });
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
        pageCount: usersData?.users.length ?? 0 / 5,
    });

    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Columns specifier for react tables
    const columns = React.useMemo(
        () => [
            table.createDataColumn("name", {
                cell: (info) => (
                    <div className="flex  justify-start py-2">
                        <Avatar
                            image={info?.row?.original?.avatar}
                            name={info?.value}
                        />
                        <div className="ml-3 my-auto ">{info?.value}</div>
                    </div>
                ),
                header: () => (
                    <div className="text-left mr-3 font-bold ">User</div>
                ),
            }),
            // table.createDataColumn((row) => row.department, {
            //     id: "created",
            //     cell: (info) => (
            //         <div className=" py-2 ">{info.value?.name}</div>
            //     ),

            //     header: () => (
            //         <div className="text-left mr-3 font-bold ">Department</div>
            //     ),
            // }),
            table.createDataColumn(
                (row) => ({
                    active: row.isActive,
                    setup: row.isSetup,
                }),
                {
                    id: "status",
                    cell: (info) => (
                        <div className=" py-2 ">
                            {info.value.setup ? (
                                info.value.active ? (
                                    <div className="badge badge-success">
                                        Active
                                    </div>
                                ) : (
                                    <div className="badge badge-error">
                                        Inactive
                                    </div>
                                )
                            ) : (
                                <div className="badge badge-warning">
                                    Pending Signup
                                </div>
                            )}
                        </div>
                    ),

                    header: () => (
                        <div className="text-left mr-3 font-bold ">Status</div>
                    ),
                }
            ),
        ],
        []
    );

    const instance = useTableInstance(table, {
        data: (usersData?.users as User[]) ?? [],
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
                        {loading ? (
                            <div className="mt-5">
                                <Loading />
                            </div>
                        ) : error ? (
                            <div>
                                Oops, these really arnt the droids you are
                                looking for 🫤
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
