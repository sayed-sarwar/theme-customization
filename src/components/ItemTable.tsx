import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, MoreVertical, GripVertical } from "lucide-react";
import { Button } from "@/component/shadcnui/button";
import { Input } from "@/component/shadcnui/input";
import { Checkbox } from "@/component/shadcnui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/component/shadcnui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/component/shadcnui/dropdown-menu";

export type ItemRow = {
  id: string;
  no: number;
  category: string;
  item: string;
  quantity: number;
  rate: number;
  tax: string;
  taxPercent: number;
  amount: number;
};

export const initialData: ItemRow[] = [
  {
    id: "1",
    no: 1,
    category: "Electronics",
    item: "Laptop",
    quantity: 2,
    rate: 50000,
    tax: "10%",
    taxPercent: 10,
    amount: 110000,
  },
  {
    id: "2",
    no: 2,
    category: "Office Supplies",
    item: "Printer Paper",
    quantity: 10,
    rate: 100,
    tax: "5%",
    taxPercent: 5,
    amount: 1050,
  },
  {
    id: "3",
    no: 3,
    category: "Electronics",
    item: "Mouse",
    quantity: 5,
    rate: 500,
    tax: "0%",
    taxPercent: 0,
    amount: 2500,
  },
];

type ItemTableProps = {
  data: ItemRow[];
  onDataChange: (data: ItemRow[]) => void;
  taxInclusive?: boolean;
  currency?: string;
};

export function ItemTable({
  data,
  onDataChange,
  taxInclusive = false,
  currency = "BDT",
}: ItemTableProps) {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [jsonData, setJsonData] = useState<string>("");

  const updateRow = (rowId: string, updates: Partial<ItemRow>) => {
    const newData = data.map((row) => {
      if (row.id === rowId) {
        const updated = { ...row, ...updates };
        // Calculate amount based on quantity, rate, and tax
        const subtotal = updated.quantity * updated.rate;
        const taxAmount = (subtotal * updated.taxPercent) / 100;
        updated.amount = taxInclusive ? subtotal : subtotal + taxAmount;
        return updated;
      }
      return row;
    });
    onDataChange(newData);
  };

  const addRow = () => {
    const newRow: ItemRow = {
      id: `row-${Date.now()}`,
      no: data.length + 1,
      category: "",
      item: "",
      quantity: 0,
      rate: 0,
      tax: "",
      taxPercent: 0,
      amount: 0,
    };
    onDataChange([...data, newRow]);
  };

  const deleteRow = (rowId: string) => {
    const newData = data
      .filter((row) => row.id !== rowId)
      .map((row, index) => ({ ...row, no: index + 1 }));
    onDataChange(newData);
  };

  const deleteSelectedRows = () => {
    const newData = data
      .filter((row) => !selectedRows[row.id])
      .map((row, index) => ({ ...row, no: index + 1 }));
    onDataChange(newData);
    setSelectedRows({});
  };

  const exportToJson = () => {
    setJsonData(JSON.stringify(data, null, 2));
  };

  // Column configuration derived from initialData structure
  const columnConfig = [
    { key: "drag", label: "", type: "action", size: 40 },
    { key: "select", label: "No.", type: "select", size: 100 },
    { key: "category", label: "Category", type: "text", size: 150 },
    { key: "item", label: "Item", type: "text", size: 200 },
    { key: "quantity", label: "Quantity", type: "number", size: 120 },
    { key: "rate", label: "Rate", type: "number", size: 120 },
    { key: "tax", label: "Tax", type: "select", size: 150 },
    { key: "amount", label: "Amount", type: "number", size: 200 },
  ];

  const createColumns = (): ColumnDef<ItemRow>[] => {
    return columnConfig.map((config) => {
      if (config.key === "drag") {
        return {
          id: "drag",
          header: "",
          cell: () => (
            <div className="flex items-center justify-center cursor-move">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
          ),
          size: config.size,
        };
      }

      if (config.key === "select") {
        return {
          id: "select",
          header: ({ table }: any) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected()
                    ? true
                    : table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : false
                }
                onCheckedChange={(value) => {
                  const newSelection: Record<string, boolean> = {};
                  if (value) {
                    data.forEach((row) => {
                      newSelection[row.id] = true;
                    });
                  }
                  setSelectedRows(newSelection);
                  table.toggleAllPageRowsSelected(!!value);
                }}
                aria-label="Select all"
              />
              <span className="text-sm font-medium">No.</span>
            </div>
          ),
          cell: ({ row }: any) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedRows[row.original.id] || false}
                onCheckedChange={(value) => {
                  setSelectedRows((prev) => ({
                    ...prev,
                    [row.original.id]: !!value,
                  }));
                  row.toggleSelected(!!value);
                }}
                aria-label="Select row"
              />
              <span className="text-sm">{row.original.no}</span>
            </div>
          ),
          size: config.size,
        };
      }

      if (config.type === "text") {
        return {
          accessorKey: config.key as keyof ItemRow,
          header: config.label,
          cell: ({ row }: any) => (
            <Input
              value={row.original[config.key]}
              onChange={(e) =>
                updateRow(row.original.id, {
                  [config.key]: e.target.value,
                })
              }
              placeholder={config.label}
              className="w-full"
            />
          ),
          size: config.size,
        };
      }

      if (config.type === "number") {
        if (config.key === "amount") {
          return {
            accessorKey: config.key as keyof ItemRow,
            header: () => (
              <div className="flex items-center gap-2">
                <span>{config.label}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
            cell: ({ row }: any) => (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={row.original.amount.toFixed(2)}
                  onChange={(e) =>
                    updateRow(row.original.id, {
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className="w-full"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={() => deleteRow(row.original.id)}
                  className="p-1 hover:bg-gray-100 rounded text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
            size: config.size,
          };
        }

        return {
          accessorKey: config.key as keyof ItemRow,
          header: config.label,
          cell: ({ row }: any) => (
            <Input
              type="number"
              value={row.original[config.key] || ""}
              onChange={(e) =>
                updateRow(row.original.id, {
                  [config.key]: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              className="w-full"
            />
          ),
          size: config.size,
        };
      }

      if (config.type === "select" && config.key === "tax") {
        return {
          accessorKey: config.key as keyof ItemRow,
          header: config.label,
          cell: ({ row }: any) => (
            <select
              value={row.original.tax}
              onChange={(e) => {
                const taxValue = e.target.value;
                const taxPercent =
                  taxValue === "5%"
                    ? 5
                    : taxValue === "10%"
                    ? 10
                    : taxValue === "15%"
                    ? 15
                    : 0;
                updateRow(row.original.id, {
                  tax: taxValue,
                  taxPercent,
                });
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            >
              <option value="">Select Tax</option>
              <option value="5%">5%</option>
              <option value="10%">10%</option>
              <option value="15%">15%</option>
            </select>
          ),
          size: config.size,
        };
      }

      return {
        accessorKey: config.key as keyof ItemRow,
        header: config.label,
        size: config.size,
      };
    });
  };

  const columns = createColumns();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const subTotal = useMemo(() => {
    return data.reduce((sum, row) => {
      const subtotal = row.quantity * row.rate;
      return sum + subtotal;
    }, 0);
  }, [data]);

  const totalTax = useMemo(() => {
    return data.reduce((sum, row) => {
      const subtotal = row.quantity * row.rate;
      const taxAmount = (subtotal * row.taxPercent) / 100;
      return sum + taxAmount;
    }, 0);
  }, [data]);

  const totalAmount = useMemo(() => {
    return data.reduce((sum, row) => sum + row.amount, 0);
  }, [data]);

  const taxPercent = subTotal > 0 ? (totalTax / subTotal) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Item Table</h2>
        <div className="flex items-center gap-3">
          <select
            value={taxInclusive ? "inclusive" : "exclusive"}
            onChange={() => {
              // This would need to be handled by parent component
            }}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
          >
            <option value="exclusive">Tax Exclusive</option>
            <option value="inclusive">Tax Inclusive</option>
          </select>
          <select
            value={currency}
            onChange={() => {
              // This would need to be handled by parent component
            }}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
          >
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="bg-gray-50"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No items. Click "Add Row" to add an item.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Add Row <span className="ml-1">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={addRow}>Add Single Row</DropdownMenuItem>
            <DropdownMenuItem>Add Multiple Rows</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={addRow}>
          Add Item in Bulk
        </Button>
        <Button variant="outline">Scan Item</Button>
        {Object.keys(selectedRows).length > 0 && (
          <Button
            variant="outline"
            onClick={deleteSelectedRows}
            className="text-red-500 hover:text-red-700"
          >
            Delete Selected ({Object.keys(selectedRows).length})
          </Button>
        )}
        <Button variant="outline" onClick={exportToJson}>
          Export to JSON
        </Button>
      </div>

      {jsonData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Exported JSON Data</h3>
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto">
            {jsonData}
          </pre>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <div className="w-80 border rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Sub Total</span>
            <span className="text-sm font-medium">
              {currency} {subTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">
              Tax ({taxPercent.toFixed(0)}%)
            </span>
            <span className="text-sm font-medium">
              {currency} {totalTax.toFixed(2)}
            </span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">
              {currency} {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
