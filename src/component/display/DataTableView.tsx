import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useState } from "react";

type Data = {
  id: number;
  name: string;
  email: string;
  status: string;
};

const columnHelper = createColumnHelper<Data>();

const DataTableView = () => {
  const [data] = useState<Data[]>([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Inactive",
    },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active" },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      status: "Active",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      status: "Inactive",
    },
    {
      id: 6,
      name: "Diana Davis",
      email: "diana@example.com",
      status: "Active",
    },
    { id: 7, name: "Eve Miller", email: "eve@example.com", status: "Active" },
    {
      id: 8,
      name: "Frank Garcia",
      email: "frank@example.com",
      status: "Inactive",
    },
    { id: 9, name: "Grace Lee", email: "grace@example.com", status: "Active" },
    {
      id: 10,
      name: "Henry Taylor",
      email: "henry@example.com",
      status: "Active",
    },
  ]);

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("status", { header: "Status" }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default DataTableView;
