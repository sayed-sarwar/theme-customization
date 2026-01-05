interface DetailViewProps {
  config: any;
  model: string;
  view: string;
  id?: string;
  onViewChange: (view: string) => void;
  availableViews: string[];
}

const DetailView = ({
  config,
  model,
  id,
  onViewChange,
  availableViews,
}: DetailViewProps) => {
  const handleEdit = () => {
    if (availableViews.includes("edit")) {
      onViewChange("edit");
    }
  };

  const handleBackToList = () => {
    if (availableViews.includes("list")) {
      onViewChange("list");
    }
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log("Deleting item...");

    // After delete, navigate back to list
    if (availableViews.includes("list")) {
      onViewChange("list");
    }
  };

  return (
    <div className="detail-view">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {model} Details {id && `#${id}`}
        </h2>

        {/* Action buttons */}
        <div className="flex gap-2">
          {availableViews.includes("list") && (
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Back to List
            </button>
          )}
          {availableViews.includes("edit") && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Detail content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {id ? (
            <div className="space-y-4">
              {/* Sample detail fields - replace with actual data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="detail-field">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    ID
                  </label>
                  <div className="text-lg text-gray-900">{id}</div>
                </div>

                <div className="detail-field">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <div className="text-lg text-gray-900">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                <div className="detail-field">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created Date
                  </label>
                  <div className="text-lg text-gray-900">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="detail-field">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Modified
                  </label>
                  <div className="text-lg text-gray-900">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Additional sections */}
              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Additional Information
                </h3>
                <div className="text-gray-600">
                  Connect to your API to load detailed information for this{" "}
                  {model}.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No ID provided. Cannot load detail view.
            </div>
          )}
        </div>
      </div>

      {/* View switcher info */}
      <div className="mt-4 text-sm text-gray-600">
        Available views: {availableViews.join(", ")}
      </div>
    </div>
  );
};

export default DetailView;
