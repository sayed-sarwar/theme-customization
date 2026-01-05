interface FormViewProps {
  config: any;
  model: string;
  view: string;
  id?: string;
  onViewChange: (view: string) => void;
  availableViews: string[];
}

const FormView = ({
  config,
  model,
  view,
  id,
  onViewChange,
  availableViews,
}: FormViewProps) => {
  const isEditMode = view === "edit" && id;
  const isCreateMode = view === "create";

  const handleCancel = () => {
    if (availableViews.includes("list")) {
      onViewChange("list");
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving form data...");

    // After save, navigate back to list or detail view
    if (availableViews.includes("list")) {
      onViewChange("list");
    }
  };

  const handleViewAfterSave = () => {
    if (availableViews.includes("view")) {
      onViewChange("view");
    }
  };

  return (
    <div className="form-view">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isEditMode
            ? `Edit ${model}`
            : isCreateMode
            ? `Create ${model}`
            : `${model} Form`}
        </h2>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          {availableViews.includes("list") && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Back to List
            </button>
          )}
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white rounded-lg shadow p-6">
        {config.fields && config.fields.length > 0 ? (
          <form className="space-y-4">
            {config.fields.map((field: any) => (
              <div key={field.name} className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label || field.name}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {field.type === "select" ? (
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select {field.label || field.name}</option>
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}

            {/* Form actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {isEditMode ? "Update" : "Create"}
              </button>
              {isCreateMode && availableViews.includes("view") && (
                <button
                  type="button"
                  onClick={handleViewAfterSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save & View
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No form fields configured. Add fields to your config to see the
            form.
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

export default FormView;
