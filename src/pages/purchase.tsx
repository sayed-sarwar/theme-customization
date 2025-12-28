import { useState, useEffect } from "react";
import { Plus, X, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Purchase = {
  id: number;
  vendor: string;
  amount: number;
  date: string;
  status: string;
};

const PurchasePage = () => {
  const navigate = useNavigate();
  const [purchaseData, setPurchaseData] = useState<Purchase[]>([
    {
      id: 1,
      vendor: "ABC Suppliers",
      amount: 25000,
      date: "2024-01-15",
      status: "Paid",
    },
    {
      id: 2,
      vendor: "XYZ Distributors",
      amount: 15500,
      date: "2024-01-14",
      status: "Pending",
    },
    {
      id: 3,
      vendor: "Tech Vendors",
      amount: 32000,
      date: "2024-01-13",
      status: "Paid",
    },
    {
      id: 4,
      vendor: "Global Traders",
      amount: 18500,
      date: "2024-01-12",
      status: "Overdue",
    },
    {
      id: 5,
      vendor: "Smart Suppliers",
      amount: 28000,
      date: "2024-01-11",
      status: "Paid",
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Purchase>>({});
  const [showToast, setShowToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let importedData: Purchase[] = [];

        // Handle JSON files
        if (file.name.endsWith(".json")) {
          importedData = JSON.parse(content);
        }
        // Handle CSV files
        else if (file.name.endsWith(".csv")) {
          const lines = content.split("\n");
          const headers = lines[0].split(",").map((h) => h.trim());

          importedData = lines
            .slice(1)
            .map((line) => {
              if (!line.trim()) return null;
              const values = line.split(",").map((v) => v.trim());
              return {
                id: parseInt(
                  values[headers.indexOf("id")] || Math.random().toString()
                ),
                vendor: values[headers.indexOf("vendor")] || "",
                amount: parseFloat(values[headers.indexOf("amount")] || "0"),
                date:
                  values[headers.indexOf("date")] ||
                  new Date().toISOString().split("T")[0],
                status: values[headers.indexOf("status")] || "Pending",
              };
            })
            .filter(Boolean) as Purchase[];
        } else {
          setShowToast({
            type: "error",
            message: "Please upload a JSON or CSV file",
          });
          return;
        }

        // Validate imported data
        if (!Array.isArray(importedData) || importedData.length === 0) {
          setShowToast({
            type: "error",
            message: "No valid data found in the file",
          });
          return;
        }

        // Merge with existing data
        const mergedData = [...purchaseData, ...importedData].reduce(
          (acc, item) => {
            const exists = acc.find((s) => s.id === item.id);
            if (!exists) {
              acc.push(item);
            }
            return acc;
          },
          [] as Purchase[]
        );

        setPurchaseData(mergedData);
        const successMessage = `Successfully imported ${importedData.length} purchase records`;
        setShowToast({
          type: "success",
          message: successMessage,
        });

        // Reset file input
        if (e.target) {
          e.target.value = "";
        }

        // Navigate to list page after 1.5 seconds
        setTimeout(() => {
          navigate("/purchase/list");
        }, 1500);
      } catch (error) {
        setShowToast({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to import data",
        });
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase</h1>
        {/* <button
          onClick={() => navigate("/purchase/new")}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
          style={{
            backgroundColor: "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
          }}
        >
          <Plus className="w-4 h-4" />
          Add New Purchase
        </button> */}
      </div>
      <div className="flex flex-col items-center gap-4 mb-6 h-150 justify-center">
        <button
          onClick={() => navigate("/purchase/new")}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
          style={{
            backgroundColor: "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
          }}
        >
          {/* <Plus className="w-4 h-4" /> */}
          Add New Purchase
        </button>
        <button
          onClick={() => navigate("/purchase/list")}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
          style={{
            borderColor: "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
            borderWidth: "1px",
            backgroundColor: "transparent",
            color: "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
          }}
        >
          <Plus className="w-4 h-4" />
          View All Purchases
        </button>
        <label className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 bg-blue-600 cursor-pointer">
          <Plus className="w-4 h-4" />
          Import Purchase Data
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleImportData}
            className="hidden"
          />
        </label>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 ${
            showToast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {showToast.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{showToast.message}</span>
          <button
            onClick={() => setShowToast(null)}
            className="ml-2 hover:opacity-80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchasePage;
