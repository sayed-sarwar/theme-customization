import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  ChevronDown,
  RefreshCw,
  Grid3x3,
  List,
  LayoutGrid,
  
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Checkbox } from "@/component/shadcnui/checkbox";
import listpageaction from "../../staticjson/listpageaction.json";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import listpage from "../../staticjson/listpage.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/component/shadcnui/dropdown-menu";


const ICONS: Record<string, any> = {
  Plus,
  ChevronDown,
  MoreVertical,
  Grid3x3,
};

type ToolbarMenuItem = {
  id: string;
  label: string;
  action: string;
  route?: string;
};

type ToolbarItem = {
  id: string;
  type: "dropdown" | "icon-button";
  label?: string;
  icon: keyof typeof ICONS;
  style?: {
    backgroundColor: string;
    textColor: string;
  };
  items?: ToolbarMenuItem[];
};

type ListPageActionsConfig = {
  toolbar: ToolbarItem[];
};

type ListPageConfig = {
  table: {
    columns: {
      key: keyof PurchaseOrder;
      label: string;
      type: string;
    }[];
  };
};

const listConfig = listpage as ListPageConfig;
const listpageActions = listpageaction as ListPageActionsConfig;

type PurchaseOrder = {
  id: number;
  orderDate: string;
  customerName: string;
  orderNo: string;
  supplier: string;
  location: string;
  totalTax: number;
  totalAmount: number;
  status: "Open" | "In Process" | "Completed";
};

const columnHelper = createColumnHelper<PurchaseOrder>();

const getStatusDotColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-500";
    case "In Process":
      return "bg-orange-500";
    case "Completed":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusCardColor = (status: string) => {
  switch (status) {
    case "Open":
      return {
        bg: "bg-blue-50",
        border: "border-blue-500",
        text: "text-blue-600",
        ring: "ring-blue-500",
      };
    case "In Process":
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-500",
        text: "text-yellow-600",
        ring: "ring-yellow-500",
      };
    case "Completed":
      return {
        bg: "bg-green-50",
        border: "border-green-500",
        text: "text-green-600",
        ring: "ring-green-500",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-500",
        text: "text-gray-600",
        ring: "ring-gray-500",
      };
  }
};

const ListTable = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if this is purchase or sales
  const isPurchase = location.pathname.includes("/purchase");
  const pageTitle = isPurchase ? "Purchase Order" : "Sales Order";

  const [purchaseData, setPurchaseData] = useState<PurchaseOrder[]>([
    {
      id: 1,
      orderDate: "March 12, 2025",
      customerName: "Lynx",
      orderNo: "12214356",
      supplier: "Amazon",
      location: "Mirpur",
      totalTax: 34.0,
      totalAmount: 12005.0,
      status: "Open",
    },
    {
      id: 2,
      orderDate: "March 13, 2025",
      customerName: "Bamboo Bears",
      orderNo: "12214357",
      supplier: "eBay",
      location: "Dhanmondi",
      totalTax: 45.0,
      totalAmount: 20010.0,
      status: "In Process",
    },
    {
      id: 3,
      orderDate: "March 15, 2025",
      customerName: "Eagles",
      orderNo: "12214359",
      supplier: "Flipkart",
      location: "Uttara",
      totalTax: 23.0,
      totalAmount: 3000.0,
      status: "Completed",
    },
  ]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Reset status filter when page/navigation changes
  useEffect(() => {
    setStatusFilter(null);
    setGlobalFilter("");
    setRowSelection({});
    setSelectedRows({});
  }, [location.pathname]);

  // Calculate status counts and totals
  const statusStats = useMemo(() => {
    const open = purchaseData.filter((item) => item.status === "Open");
    const inProcess = purchaseData.filter(
      (item) => item.status === "In Process"
    );
    const completed = purchaseData.filter(
      (item) => item.status === "Completed"
    );

    return {
      open: {
        count: open.length,
        total: open.reduce((sum, item) => sum + item.totalAmount, 0),
      },
      inProcess: {
        count: inProcess.length,
        total: inProcess.reduce((sum, item) => sum + item.totalAmount, 0),
      },
      completed: {
        count: completed.length,
        total: completed.reduce((sum, item) => sum + item.totalAmount, 0),
      },
    };
  }, [purchaseData]);

  // Format date to display format
  const formatDate = (dateString: string) => {
    return dateString; // Already formatted in data
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TK ${amount.toFixed(2)}`;
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Group data by status for Kanban view
  const kanbanData = useMemo(() => {
    const open = purchaseData.filter((item) => item.status === "Open");
    const inProcess = purchaseData.filter(
      (item) => item.status === "In Process"
    );
    const completed = purchaseData.filter(
      (item) => item.status === "Completed"
    );

    return { open, inProcess, completed };
  }, [purchaseData]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: any) => (
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
                purchaseData.forEach((row) => {
                  newSelection[row.id.toString()] = true;
                });
              }
              setSelectedRows(newSelection);
              table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }: any) => (
          <Checkbox
            checked={selectedRows[row.original.id.toString()] || false}
            onCheckedChange={(value) => {
              setSelectedRows((prev) => ({
                ...prev,
                [row.original.id.toString()]: !!value,
              }));
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      columnHelper.accessor("orderDate", {
        header: "Order Date",
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor("customerName", {
        header: "Customer Name",
      }),
      columnHelper.accessor("orderNo", {
        header: "Order No",
      }),
      columnHelper.accessor("supplier", {
        header: "Supplier",
      }),
      columnHelper.accessor("location", {
        header: "Location",
      }),
      columnHelper.accessor("totalTax", {
        header: "Total tax",
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor("totalAmount", {
        header: "Total Amount",
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          return (
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`}
              />
              <span className="text-sm text-gray-700">{status}</span>
            </div>
          );
        },
      }),
      {
        id: "actions",
        header: "",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                navigate(
                  `/${isPurchase ? "purchase" : "sales"}/view/${
                    row.original.id
                  }`
                )
              }
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                navigate(
                  `/${isPurchase ? "purchase" : "sales"}/edit/${
                    row.original.id
                  }`
                )
              }
              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this order?")) {
                  setPurchaseData((prev) =>
                    prev.filter((item) => item.id !== row.original.id)
                  );
                }
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Print</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [navigate, isPurchase, selectedRows, purchaseData]
  );

  // Filter data based on status filter
  const filteredData = useMemo(() => {
    if (statusFilter) {
      return purchaseData.filter((item) => item.status === statusFilter);
    }
    return purchaseData;
  }, [purchaseData, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          {listpageActions.toolbar.map((item) => {

  if (item.type === "dropdown") {
    const Icon = ICONS[item.icon];
    const style = item.style ?? {
      backgroundColor: "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
      textColor: "white",
    };

    return (
      <DropdownMenu key={item.id}>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90"
            style={{
              backgroundColor: style.backgroundColor,
              color: style.textColor,
            }}
          >
            <Icon className="w-4 h-4" />
            {item.label?.replace("{{pageTitle}}", pageTitle)}
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {item.items?.map((menu) => (
            <DropdownMenuItem
              key={menu.id}
              onClick={() => {
                if (menu.action === "navigate") {
                  navigate(
                    menu.route.replace(
                      "{{module}}",
                      isPurchase ? "purchase" : "sales"
                    )
                  );
                }
              }}
            >
              {menu.label.replace("{{pageTitle}}", pageTitle)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // ICON BUTTONS
  if (item.type === "icon-button") {
    const Icon = ICONS[item.icon];

    return (
      <button
        key={item.id}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Icon className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return null;
})}


      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() =>
            setStatusFilter(statusFilter === "Open" ? null : "Open")
          }
          className={`rounded-lg shadow-sm p-6 border-l-4 transition-all cursor-pointer hover:shadow-md ${
            statusFilter === "Open"
              ? `${getStatusCardColor("Open").bg} ${
                  getStatusCardColor("Open").border
                } ring-2 ${getStatusCardColor("Open").ring}`
              : "bg-white border-blue-500"
          }`}
        >
          <div className="text-sm font-medium text-gray-600">Open</div>
          <div
            className={`text-2xl font-bold mt-2 ${
              getStatusCardColor("Open").text
            }`}
          >
            {statusStats.open.count} Open
          </div>
          <div className="text-sm font-semibold text-gray-700 mt-2">
            {formatCurrency(statusStats.open.total)}
          </div>
        </button>

        <button
          onClick={() =>
            setStatusFilter(statusFilter === "In Process" ? null : "In Process")
          }
          className={`rounded-lg shadow-sm p-6 border-l-4 transition-all cursor-pointer hover:shadow-md ${
            statusFilter === "In Process"
              ? `${getStatusCardColor("In Process").bg} ${
                  getStatusCardColor("In Process").border
                } ring-2 ${getStatusCardColor("In Process").ring}`
              : "bg-white border-yellow-500"
          }`}
        >
          <div className="text-sm font-medium text-gray-600">In Process</div>
          <div
            className={`text-2xl font-bold mt-2 ${
              getStatusCardColor("In Process").text
            }`}
          >
            {statusStats.inProcess.count} In Process
          </div>
          <div className="text-sm font-semibold text-gray-700 mt-2">
            {formatCurrency(statusStats.inProcess.total)}
          </div>
        </button>

        <button
          onClick={() =>
            setStatusFilter(statusFilter === "Completed" ? null : "Completed")
          }
          className={`rounded-lg shadow-sm p-6 border-l-4 transition-all cursor-pointer hover:shadow-md ${
            statusFilter === "Completed"
              ? `${getStatusCardColor("Completed").bg} ${
                  getStatusCardColor("Completed").border
                } ring-2 ${getStatusCardColor("Completed").ring}`
              : "bg-white border-green-500"
          }`}
        >
          <div className="text-sm font-medium text-gray-600">Completed</div>
          <div
            className={`text-2xl font-bold mt-2 ${
              getStatusCardColor("Completed").text
            }`}
          >
            {statusStats.completed.count} Completed
          </div>
          <div className="text-sm font-semibold text-gray-700 mt-2">
            {formatCurrency(statusStats.completed.total)}
          </div>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-gray-600" />
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>List for Sim</option>
                  <option>All Records</option>
                  <option>Recent Orders</option>
                </select>
              </div>
              <button
                onClick={() =>
                  setViewMode(viewMode === "table" ? "kanban" : "table")
                }
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                  viewMode === "kanban"
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
                title="Kanban View"
              >
                <LayoutGrid className="w-4 h-4" />
                Kanban View
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGlobalFilter("")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  setGlobalFilter("");
                  setStatusFilter(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="View Options"
              >
                <Grid3x3 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          {/* Search Input */}
          {globalFilter !== "" && (
            <div className="mt-3 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={
                  {
                    "--tw-ring-color":
                      "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
                  } as React.CSSProperties
                }
              />
            </div>
          )}
        </div>

        {/* Table View */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {header.column.getCanSort() ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1 hover:text-gray-900"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-700"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Kanban View */
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Open Column */}
              <div className="flex flex-col">
                <div className="mb-4 pb-3 border-b-2 border-blue-500">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Open
                    </span>
                    <span className="text-xs text-gray-500 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {kanbanData.open.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {kanbanData.open.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm  p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/${isPurchase ? "purchase" : "sales"}/view/${
                            item.id
                          }`
                        )
                      }
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                            {getInitials(item.customerName)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.customerName}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span
                                className={`w-2 h-2 rounded-full ${getStatusDotColor(
                                  item.status
                                )}`}
                              />
                              <span className="text-xs text-gray-600">
                                • Open
                              </span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/${isPurchase ? "purchase" : "sales"}/view/${
                                    item.id
                                  }`
                                );
                              }}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/${isPurchase ? "purchase" : "sales"}/edit/${
                                    item.id
                                  }`
                                );
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setPurchaseData((prev) =>
                                  prev.filter((i) => i.id !== item.id)
                                );
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Date: {item.orderDate}</div>
                        <div>Supplier: {item.supplier}</div>
                        <div>Order No.: {item.orderNo}</div>
                        <div className="font-semibold text-gray-900 mt-2">
                          Value: {formatCurrency(item.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {kanbanData.open.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      No items
                    </div>
                  )}
                </div>
              </div>

              {/* In Process Column */}
              <div className="flex flex-col">
                <div className="mb-4 pb-3 border-b-2 border-orange-500">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      In Process
                    </span>
                    <span className="text-xs text-gray-500 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      {kanbanData.inProcess.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {kanbanData.inProcess.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm  p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/${isPurchase ? "purchase" : "sales"}/view/${
                            item.id
                          }`
                        )
                      }
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-sm">
                            {getInitials(item.customerName)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.customerName}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span
                                className={`w-2 h-2 rounded-full ${getStatusDotColor(
                                  item.status
                                )}`}
                              />
                              <span className="text-xs text-gray-600">
                                • In Process
                              </span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/${isPurchase ? "purchase" : "sales"}/view/${
                                    item.id
                                  }`
                                );
                              }}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/${isPurchase ? "purchase" : "sales"}/edit/${
                                    item.id
                                  }`
                                );
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setPurchaseData((prev) =>
                                  prev.filter((i) => i.id !== item.id)
                                );
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Date: {item.orderDate}</div>
                        <div>Supplier: {item.supplier}</div>
                        <div>Order No.: {item.orderNo}</div>
                        <div className="font-semibold text-gray-900 mt-2">
                          Value: {formatCurrency(item.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {kanbanData.inProcess.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      No items
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Column */}
              <div className="flex flex-col">
                <div className="mb-4 pb-3 border-b-2 border-green-500">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Completed
                    </span>
                    <span className="text-xs text-gray-500 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {kanbanData.completed.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {kanbanData.completed.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm  p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/${isPurchase ? "purchase" : "sales"}/view/${
                            item.id
                          }`
                        )
                      }
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                            {getInitials(item.customerName)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.customerName}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span
                                className={`w-2 h-2 rounded-full ${getStatusDotColor(
                                  item.status
                                )}`}
                              />
                              <span className="text-xs text-gray-600">
                                • Completed
                              </span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/${isPurchase ? "purchase" : "sales"}/view/${
                                    item.id
                                  }`
                                );
                              }}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/${isPurchase ? "purchase" : "sales"}/edit/${
                                    item.id
                                  }`
                                );
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setPurchaseData((prev) =>
                                  prev.filter((i) => i.id !== item.id)
                                );
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Date: {item.orderDate}</div>
                        <div>Supplier: {item.supplier}</div>
                        <div>Order No.: {item.orderNo}</div>
                        <div className="font-semibold text-gray-900 mt-2">
                          Value: {formatCurrency(item.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {kanbanData.completed.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      No items
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListTable;
