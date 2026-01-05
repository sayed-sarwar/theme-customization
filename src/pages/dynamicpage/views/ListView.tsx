interface ListViewProps {
  config: any;
  model: string;
  view: string;
  id?: string;
  onViewChange: (view: string) => void;
  availableViews: string[];
}

const ListView = ({
  config,
  model,
  onViewChange,
  availableViews,
}: ListViewProps) => {
  const handleCreateNew = () => {
    if (availableViews.includes("create")) {
      onViewChange("create");
    }
  };

  const handleViewItem = (itemId: string) => {
    if (availableViews.includes("view")) {
      onViewChange("view");
      // You might want to navigate to the specific item
      // This would require updating the URL with the item ID
    }
  };

  const handleEditItem = (itemId: string) => {
    if (availableViews.includes("edit")) {
      onViewChange("edit");
    }
  };

  return (
    <div className="list-view">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {config.title || `${model} List`}
        </h2>

        {/* Action buttons */}
        <div className="flex gap-2">
          {availableViews.includes("create") && (
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create New
            </button>
          )}
        </div>
      </div>

      {/* List content */}
      <div className="bg-white rounded-lg shadow">
        {config.columns && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {config.columns.map((column: any) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample data - replace with actual data */}
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No data available. Connect to your API to load data.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View switcher info */}
      <div className="mt-4 text-sm text-gray-600">
        Available views: {availableViews.join(", ")}
      </div>
    </div>
  );
};

export default ListView;
