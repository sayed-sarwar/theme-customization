import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataView } from "../components/DataView";
import type { ViewType } from "../components/DataView";

interface Task {
  id: number;
  name: string;
  status: "pending" | "in-progress" | "completed";
  assignee: string;
  priority: string;
}

const columnHelper = createColumnHelper<Task>();

const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Task Name" }),
  columnHelper.accessor("status", { header: "Status" }),
  columnHelper.accessor("assignee", { header: "Assignee" }),
  columnHelper.accessor("priority", { header: "Priority" }),
];

const sampleData: Task[] = [
  {
    id: 1,
    name: "Design Homepage",
    status: "pending",
    assignee: "John",
    priority: "High",
  },
  {
    id: 2,
    name: "Setup Database",
    status: "in-progress",
    assignee: "Jane",
    priority: "Medium",
  },
  {
    id: 3,
    name: "Write Tests",
    status: "completed",
    assignee: "Bob",
    priority: "Low",
  },
  {
    id: 4,
    name: "Deploy App",
    status: "pending",
    assignee: "Alice",
    priority: "High",
  },
];

export default function DataExample() {
  const [viewType, setViewType] = useState<ViewType>("list");

  return (
    <DataView
      data={sampleData}
      columns={columns}
      viewType={viewType}
      onViewChange={setViewType}
    />
  );
}
