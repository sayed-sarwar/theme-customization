import type { ViewType } from "./types";

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      <button
        onClick={() => onViewChange("list")}
        style={{
          padding: "8px 16px",
          backgroundColor: currentView === "list" ? "#007bff" : "#f8f9fa",
          color: currentView === "list" ? "white" : "#333",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        List
      </button>
      <button
        onClick={() => onViewChange("grid")}
        style={{
          padding: "8px 16px",
          backgroundColor: currentView === "grid" ? "#007bff" : "#f8f9fa",
          color: currentView === "grid" ? "white" : "#333",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        Grid
      </button>
      <button
        onClick={() => onViewChange("kanban")}
        style={{
          padding: "8px 16px",
          backgroundColor: currentView === "kanban" ? "#007bff" : "#f8f9fa",
          color: currentView === "kanban" ? "white" : "#333",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        Kanban
      </button>
    </div>
  );
}
