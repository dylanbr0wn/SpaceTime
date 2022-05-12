import { TableGenerics, TableInstance } from "@tanstack/react-table";

import Sorting from "./Sorting";

const DefaultTable = <T extends TableGenerics>({
    instance,
}: {
    instance: TableInstance<T>;
}) => {
    return (
        <table className="table table-zebra w-full flex flex-col">
            <thead>
                {instance.getHeaderGroups().map((headerGroup) => (
                    <tr className="flex" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th className="p-4 w-full" key={header.id}>
                                <div
                                    className="inline-flex h-full cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div>
                                        {header.isPlaceholder
                                            ? null
                                            : header.renderHeader()}
                                    </div>
                                    <Sorting
                                        isSorted={
                                            header.column.getIsSorted() as string
                                        }
                                    />
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody className="flex flex-col">
                {instance.getRowModel().rows.map((row) => (
                    <tr className=" flex hover " key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td className="py-2 px-4 w-full" key={cell.id}>
                                {cell.renderCell()}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
export default DefaultTable;
