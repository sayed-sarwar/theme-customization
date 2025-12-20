import { flexRender } from "@tanstack/react-table";
import type { Table } from "@tanstack/react-table";
import { useLanguage } from "../../context/LanguageContext";

interface ListViewProps<T> {
  table: Table<T>;
}

const data = [
  { name: "John", age: 28, city: "New York" },
  { name: "Alice", age: 24, city: "Los Angeles" },
  { name: "Bob", age: 30, city: "Chicago" },
];

export function ListView<T>({ table }: ListViewProps<T>) {
  const { isRTL } = useLanguage();

  console.log("Rendering ListView with RTL:", table, isRTL);

  return (
    <div
      className="table-container rtl-aware"
      style={{
        overflowX: "auto",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    padding: "12px",
                    textAlign: isRTL ? "right" : "left",
                    borderBottom: "2px solid #ddd",
                    backgroundColor: "#f8f9fa",
                    cursor: "default",
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {header.column.getCanSort() && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "8px",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              header.column.toggleSorting(false);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px",
                              fontSize: "10px",
                              opacity:
                                header.column.getIsSorted() === "asc" ? 1 : 0.5,
                            }}
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              header.column.toggleSorting(true);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px",
                              fontSize: "10px",
                              opacity:
                                header.column.getIsSorted() === "desc"
                                  ? 1
                                  : 0.5,
                            }}
                          >
                            ▼
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
