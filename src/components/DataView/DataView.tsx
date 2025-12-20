import { useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ViewType, DataViewProps } from "./types";
import { ViewToggle } from "./ViewToggle";
import { ListView } from "./ListView";
import { GridView } from "./GridView";
import { KanbanView } from "./KanbanView";

export function DataView<T>({
  data,
  columns,
  viewType,
  onViewChange,
}: DataViewProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderView = () => {
    switch (viewType) {
      case "list":
        return <ListView table={table} />;
      case "grid":
        return <GridView data={data} />;
      case "kanban":
        return <KanbanView data={data} />;
      default:
        return <ListView table={table} />;
    }
  };

  return (
    <div>
      <ViewToggle currentView={viewType} onViewChange={onViewChange} />
      {renderView()}
    </div>
  );
}
