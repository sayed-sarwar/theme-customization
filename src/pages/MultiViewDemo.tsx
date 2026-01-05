import { useState } from "react";
import { Link } from "react-router-dom";

const MultiViewDemo = () => {
  const [selectedModel, setSelectedModel] = useState("sales_order");

  const availableModels = [
    {
      key: "sales_order",
      label: "Sales Order",
      views: ["list", "create", "view", "edit"],
    },
    {
      key: "purchase_order",
      label: "Purchase Order",
      views: ["list", "create", "view", "edit"],
    },
    {
      key: "product",
      label: "Product (Example)",
      views: ["list", "create", "view", "edit", "analytics"],
    },
    {
      key: "new_sales",
      label: "New Sales Form (Advanced)",
      views: ["create"],
    },
  ];

  const selectedModelData = availableModels.find(
    (m) => m.key === selectedModel
  );

  return (
    <div className="multi-view-demo p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dynamic Page Multiple Views Demo
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            How Multiple Views Work
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              • Each model can have multiple views (list, create, edit, view,
              etc.)
            </p>
            <p>• Views are defined in JSON configuration files</p>
            <p>
              • Users can switch between views using tabs or navigation buttons
            </p>
            <p>• Each view can have different permissions and configurations</p>
            <p>
              • The system automatically handles navigation and state management
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select a Model to Test</h2>

          <div className="mb-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableModels.map((model) => (
                <option key={model.key} value={model.key}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {selectedModelData && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Available Views for {selectedModelData.label}:
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {selectedModelData.views.map((view) => (
                  <Link
                    key={view}
                    to={`/${selectedModel}/${view}`}
                    className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-center"
                  >
                    <div className="font-medium text-blue-800">{view}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {view === "list" && "Browse items"}
                      {view === "create" && "Add new item"}
                      {view === "view" && "View details"}
                      {view === "edit" && "Edit item"}
                      {view === "analytics" && "View analytics"}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">URL Structure</h2>
          <div className="space-y-2 text-sm font-mono bg-white p-4 rounded border">
            <div>/{selectedModel}/list - List all items</div>
            <div>/{selectedModel}/create - Create new item</div>
            <div>/{selectedModel}/view/123 - View item with ID 123</div>
            <div>/{selectedModel}/edit/123 - Edit item with ID 123</div>
            {selectedModel === "product" && (
              <div>
                /{selectedModel}/analytics/123 - View analytics for item 123
              </div>
            )}
            {selectedModel === "new_sales" && (
              <div className="text-blue-600 font-semibold">
                /{selectedModel}/create - Advanced sales form with tabs, item
                table, and attachments
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiViewDemo;
