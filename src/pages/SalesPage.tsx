import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter, Edit, Edit2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

type Sale = {
  id: number;
  customer: string;
  amount: number;
  date: string;
  status: string;
};

const columnHelper = createColumnHelper<Sale>();

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const SalesPage = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState<Sale[]>([
    {
      id: 1,
      customer: "ABC Corp",
      amount: 15000,
      date: "2024-01-15",
      status: "Paid",
    },
    {
      id: 2,
      customer: "XYZ Ltd",
      amount: 8500,
      date: "2024-01-14",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Tech Solutions",
      amount: 22000,
      date: "2024-01-13",
      status: "Paid",
    },
    {
      id: 4,
      customer: "Global Inc",
      amount: 12500,
      date: "2024-01-12",
      status: "Overdue",
    },
    {
      id: 5,
      customer: "Smart Systems",
      amount: 18000,
      date: "2024-01-11",
      status: "Paid",
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Sale>>({});

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleInlineEdit = (row: Sale) => {
    setEditingRow(row.id);
    setEditData(row);
  };

  const handleSave = () => {
    setSalesData(prev => prev.map(item => 
      item.id === editingRow ? { ...item, ...editData } : item
    ));
    setEditingRow(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditData({});
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => `#${info.getValue()}`,
      }),
      columnHelper.accessor("customer", {
        header: "Customer",
        cell: ({ row }) => {
          const isEditing = editingRow === row.original.id;
          return isEditing ? (
            <input
              type="text"
              value={editData.customer || row.original.customer}
              onChange={(e) => setEditData({ ...editData, customer: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          ) : (
            row.original.customer
          );
        },
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: ({ row }) => {
          const isEditing = editingRow === row.original.id;
          return isEditing ? (
            <input
              type="number"
              value={editData.amount || row.original.amount}
              onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          ) : (
            `$${row.original.amount.toLocaleString()}`
          );
        },
      }),
      columnHelper.accessor("date", {
        header: "Date",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              info.getValue()
            )}`}
          >
            {info.getValue()}
          </span>
        ),
      }),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const isEditing = editingRow === row.original.id;
          return (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate(`/sales/edit/${row.original.id}`)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleInlineEdit(row.original)}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Inline Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [editingRow, editData, navigate, handleInlineEdit, handleSave, handleCancel]
  );

  const table = useReactTable({
    data: salesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => navigate("/sales/new")}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
          style={{ backgroundColor: 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' }}
        >
          <Plus className="w-4 h-4" />
          New Sale
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search sales..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' } as React.CSSProperties}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
