import { useState, useMemo, useEffect } from "react";
import * as React from "react";
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
  Copy,
  Printer,
  Download,
  Upload,
  Zap,
  Settings,
  Package,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Checkbox } from "@/component/shadcnui/checkbox";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/component/shadcnui/dropdown-menu";
import listTableConfig from "../../staticjson/listTableConfig.json";

const ICONS: Record<string, any> = {
  Plus,
  ChevronDown,
  MoreVertical,
  Grid3x3,
  Search,
  Edit,
  Eye,
  Trash2,
  RefreshCw,
  List,
  LayoutGrid,
  Copy,
  Printer,
  Download,
  Upload,
  Zap,
  Settings,
  Package,
};

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
  const config = listTableConfig.statusSummary.cards.find(
    (card) => card.key === status
  );
  return config?.color.dot || "bg-gray-500";
};

const ListTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const config = listTableConfig;

  // Detect if this is purchase or sales
  const isPurchase = location.pathname.includes("/purchase");
  const pageTitle = isPurchase
    ? config.pageConfig.title.purchase
    : config.pageConfig.title.sales;

  const [purchaseData, setPurchaseData] = useState<PurchaseOrder[]>(
    config.sampleData as PurchaseOrder[]
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"table" | "kanban">(
    config.pageConfig.defaultView as "table" | "kanban"
  );

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

  // Calculate status counts and totals using config
  const statusStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {};

    config.statusSummary.cards.forEach((card) => {
      const items = purchaseData.filter((item) => item.status === card.key);
      stats[card.key] = {
        count: items.length,
        total: items.reduce((sum, item) => sum + item.totalAmount, 0),
      };
    });

    return stats;
  }, [purchaseData, config.statusSummary.cards]);

  // Format date to display format
  const formatDate = (dateString: string) => {
    return dateString; // Already formatted in data
  };

  // Format currency using config
  const formatCurrency = (amount: number) => {
    return `${config.pageConfig.currency} ${amount.toFixed(2)}`;
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

  // Group data by status for Kanban view using config
  const kanbanData = useMemo(() => {
    const grouped: Record<string, PurchaseOrder[]> = {};

    config.kanbanConfig.columns.forEach((column) => {
      grouped[column.key] = purchaseData.filter(
        (item) => item.status === column.key
      );
    });

    return grouped;
  }, [purchaseData, config.kanbanConfig.columns]);

  // Generate columns from config
  const columns = useMemo(() => {
    const cols = [];

    // Add selection column if enabled
    if (config.tableConfig.rowSelection.enabled) {
      cols.push({
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
      });
    }

    // Add data columns from config
    config.tableConfig.columns.forEach((column) => {
      if (column.type === "date") {
        cols.push(
          columnHelper.accessor(column.key as keyof PurchaseOrder, {
            header: column.label,
            cell: (info) => formatDate(info.getValue() as string),
          })
        );
      } else if (column.type === "currency") {
        cols.push(
          columnHelper.accessor(column.key as keyof PurchaseOrder, {
            header: column.label,
            cell: (info) => formatCurrency(info.getValue() as number),
          })
        );
      } else if (column.type === "badge") {
        cols.push(
          columnHelper.accessor(column.key as keyof PurchaseOrder, {
            header: column.label,
            cell: (info) => {
              const status = info.getValue() as string;
              return (
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${getStatusDotColor(
                      status
                    )}`}
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </div>
              );
            },
          })
        );
      } else {
        cols.push(
          columnHelper.accessor(column.key as keyof PurchaseOrder, {
            header: column.label,
          })
        );
      }
    });

    // Add actions column if enabled
    if (config.tableConfig.actions.enabled) {
      cols.push({
        id: "actions",
        header: "",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-2">
            {config.tableConfig.actions.items.map((action) => {
              if (action.type === "dropdown") {
                return (
                  <DropdownMenu key={action.key}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                        title={action.tooltip}
                      >
                        {ICONS[action.icon] &&
                          React.createElement(ICONS[action.icon], {
                            className: "w-4 h-4",
                          })}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {action.items?.map((item) => (
                        <DropdownMenuItem
                          key={item.key}
                          onClick={() => {
                            if (item.action === "navigate") {
                              navigate(
                                `/${isPurchase ? "purchase" : "sales"}/${
                                  item.key
                                }/${row.original.id}`
                              );
                            } else if (item.action === "delete") {
                              if (
                                confirm(
                                  "Are you sure you want to delete this order?"
                                )
                              ) {
                                setPurchaseData((prev) =>
                                  prev.filter(
                                    (item) => item.id !== row.original.id
                                  )
                                );
                              }
                            }
                          }}
                        >
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              } else {
                const colorClass =
                  action.color === "blue"
                    ? "text-blue-600 hover:bg-blue-50"
                    : action.color === "green"
                    ? "text-green-600 hover:bg-green-50"
                    : action.color === "red"
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-600 hover:bg-gray-50";

                return (
                  <button
                    key={action.key}
                    onClick={() => {
                      if (action.action === "navigate") {
                        navigate(
                          `/${isPurchase ? "purchase" : "sales"}/${
                            action.key
                          }/${row.original.id}`
                        );
                      } else if (action.action === "delete") {
                        if (
                          !action.confirm?.enabled ||
                          confirm(action.confirm.message || "Are you sure?")
                        ) {
                          setPurchaseData((prev) =>
                            prev.filter((item) => item.id !== row.original.id)
                          );
                        }
                      }
                    }}
                    className={`p-1.5 rounded transition-colors ${colorClass}`}
                    title={action.tooltip}
                  >
                    {ICONS[action.icon] &&
                      React.createElement(ICONS[action.icon], {
                        className: "w-4 h-4",
                      })}
                  </button>
                );
              }
            })}
          </div>
        ),
      });
    }

    return cols;
  }, [navigate, isPurchase, selectedRows, purchaseData, config]);

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
        <div className="flex items-center gap-2">
          {config.headerActions.primary.map((item) => {
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
                      style={{ minWidth: "150px",backgroundColor: "white" }}
                        key={menu.id}
                        onClick={() => {
                          if (menu.action === "navigate" && menu.route) {
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
            return null;
          })}

          {config.headerActions.secondary.map((item) => {
            if (item.type === "icon-button") {
              const Icon = ICONS[item.icon];
              return (
                <button
                  key={item.id}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={item.tooltip}
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                </button>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {config.statusSummary.cards.map((card) => (
          <button
            key={card.key}
            onClick={() =>
              setStatusFilter(statusFilter === card.key ? null : card.key)
            }
            className={`rounded-lg shadow-sm p-6 border-l-4 transition-all cursor-pointer hover:shadow-md ${
              statusFilter === card.key
                ? `${card.color.bg} ${card.color.border} ring-2 ${card.color.ring}`
                : `bg-white ${card.color.border}`
            }`}
          >
            <div className="text-sm font-medium text-gray-600">
              {card.label}
            </div>
            <div className={`text-2xl font-bold mt-2 ${card.color.text}`}>
              {statusStats[card.key]?.count || 0} {card.label}
            </div>
            <div className="text-sm font-semibold text-gray-700 mt-2">
              {formatCurrency(statusStats[card.key]?.total || 0)}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-gray-600" />
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {config.filters.quickFilters[0].options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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
                placeholder={config.filters.globalSearch.placeholder}
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
                      {config.emptyState.table.message}
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
              {config.kanbanConfig.columns.map((column) => (
                <div key={column.key} className="flex flex-col">
                  <div className={`mb-4 pb-3 border-b-2 ${column.borderColor}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {column.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${column.badgeColor}`}
                      >
                        {kanbanData[column.key]?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {kanbanData[column.key]?.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
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
                            <div
                              className={`w-10 h-10 rounded-full ${column.avatarColor} flex items-center justify-center font-semibold text-sm`}
                            >
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
                                  • {item.status}
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
                              {config.kanbanConfig.card.actions.items.map(
                                (action) => (
                                  <DropdownMenuItem
                                    key={action.key}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (action.action === "navigate") {
                                        navigate(
                                          `/${
                                            isPurchase ? "purchase" : "sales"
                                          }/${action.key}/${item.id}`
                                        );
                                      } else if (action.action === "delete") {
                                        if (
                                          !action.confirm ||
                                          confirm(
                                            "Are you sure you want to delete this order?"
                                          )
                                        ) {
                                          setPurchaseData((prev) =>
                                            prev.filter((i) => i.id !== item.id)
                                          );
                                        }
                                      }
                                    }}
                                  >
                                    {action.label}
                                  </DropdownMenuItem>
                                )
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          {config.kanbanConfig.card.fields.map((field) => (
                            <div key={field.key}>
                              {field.label}:{" "}
                              {field.type === "currency"
                                ? formatCurrency(
                                    item[
                                      field.key as keyof PurchaseOrder
                                    ] as number
                                  )
                                : item[field.key as keyof PurchaseOrder]}
                            </div>
                          ))}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center text-gray-400 text-sm py-8">
                        {config.emptyState.kanban.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListTable;
