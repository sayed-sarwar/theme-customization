import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useState } from "react";

type Entry = {
  id: number;
  name: string;
  date: string;
  amount: number;
};

const columnHelper = createColumnHelper<Entry>();

const DataTableEntry = () => {
  const [data, setData] = useState<Entry[]>([
    { id: 1, name: "Entry 1", date: "2024-01-01", amount: 100 },
    { id: 2, name: "Entry 2", date: "2024-01-02", amount: 200 },
  ]);

  const updateData = (rowIndex: number, columnId: string, value: string) => {
    setData((old) =>
      old.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ getValue, row, column }) => (
        <input
          value={getValue()}
          onChange={(e) => updateData(row.index, column.id, e.target.value)}
        />
      ),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: ({ getValue, row, column }) => (
        <input
          type="date"
          value={getValue()}
          onChange={(e) => updateData(row.index, column.id, e.target.value)}
        />
      ),
    }),
    columnHelper.accessor("amount", { header: "Amount" }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData },
  });

  return (
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
  );
};

export default DataTableEntry;
