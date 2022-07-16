import { Table, flexRender } from "@tanstack/react-table";
import Sorting from "./Sorting";

const DefaultTable = <T extends {}>({ instance }: { instance: Table<T> }) => {
	return (
		<>
			<table className="table table-zebra w-full flex flex-col h-96">
				<thead className="flex flex-col">
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
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</div>
										<Sorting isSorted={header.column.getIsSorted() as string} />
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="flex flex-col h-full">
					{instance.getRowModel().rows.map((row) => (
						<tr className=" flex hover " key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td className="py-2 px-4 w-full" key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className="flex w-full">
				<div className="btn-group content-end mt-2 mx-auto">
					<button
						className="btn"
						onClick={() => instance.setPageIndex(0)}
						disabled={!instance.getCanPreviousPage()}
					>
						{"<<"}
					</button>
					<button
						className="btn"
						onClick={() => instance.previousPage()}
						disabled={!instance.getCanPreviousPage()}
					>
						{"<"}
					</button>
					<button
						className="btn btn-active"
						onClick={() => instance.nextPage()}
						disabled={!instance.getCanNextPage()}
					>
						{instance.getState().pagination.pageIndex + 1}
					</button>
					<button
						className="btn"
						onClick={() => instance.nextPage()}
						disabled={!instance.getCanNextPage()}
					>
						{">"}
					</button>
					<button
						className="btn"
						onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
						disabled={!instance.getCanNextPage()}
					>
						{">>"}
					</button>
					{/* <span className="flex items-center space-x-1 ml-1">
                        <div>Page</div>
                        <strong>
                            {instance.getState().pagination.pageIndex + 1} of{" "}
                            {instance.getPageCount()}
                        </strong>
                    </span> */}
					{/* <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={
                            instance.getState().pagination.pageIndex + 1
                        }
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            instance.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span> */}
					{/* <select
                    value={instance.getState().pagination.pageSize}
                    onChange={(e) => {
                        instance.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select> */}
				</div>
			</div>
		</>
	);
};
export default DefaultTable;
