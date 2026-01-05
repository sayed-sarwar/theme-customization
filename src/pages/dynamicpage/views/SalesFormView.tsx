import { useState } from "react";

interface SalesFormViewProps {
  config: any;
  model: string;
  view: string;
  id?: string;
  onViewChange: (view: string) => void;
  availableViews: string[];
}

const SalesFormView = ({
  config,
  onViewChange,
  availableViews,
}: SalesFormViewProps) => {
  const [activeTab, setActiveTab] = useState("item-details");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [items, setItems] = useState([
    { ...config.itemTableConfig.defaultRow },
  ]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleAddItem = () => {
    const newItem = {
      ...config.itemTableConfig.defaultRow,
      no: items.length + 1,
      id: Date.now().toString(),
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Calculate amount if quantity or rate changes
    if (field === "quantity" || field === "rate") {
      const quantity =
        field === "quantity" ? value : updatedItems[index].quantity;
      const rate = field === "rate" ? value : updatedItems[index].rate;
      updatedItems[index].amount = quantity * rate;
    }

    setItems(updatedItems);
  };

  const renderFormField = (fieldKey: string, fieldConfig: any) => {
    const value = formData[fieldKey] || fieldConfig.defaultValue || "";

    switch (fieldConfig.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            placeholder={fieldConfig.placeholder}
            required={fieldConfig.required}
            disabled={fieldConfig.disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              handleFieldChange(fieldKey, parseFloat(e.target.value) || 0)
            }
            placeholder={fieldConfig.placeholder}
            required={fieldConfig.required}
            disabled={fieldConfig.disabled}
            min={fieldConfig.validation?.min}
            max={fieldConfig.validation?.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={
              value === "today" ? new Date().toISOString().split("T")[0] : value
            }
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            required={fieldConfig.required}
            disabled={fieldConfig.disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            required={fieldConfig.required}
            disabled={fieldConfig.disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select {fieldConfig.label}</option>
            {fieldConfig.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            placeholder={fieldConfig.placeholder}
            required={fieldConfig.required}
            disabled={fieldConfig.disabled}
            rows={fieldConfig.rows || 3}
            maxLength={fieldConfig.validation?.maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      default:
        return null;
    }
  };

  const renderItemTable = () => (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {config.itemTableConfig.columns.map((column: any) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={item.id || index}>
                {config.itemTableConfig.columns.map((column: any) => (
                  <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                    {column.editable ? (
                      column.type === "select" ? (
                        <select
                          value={item[column.key] || ""}
                          onChange={(e) =>
                            handleItemChange(index, column.key, e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select</option>
                          {column.options?.map((option: any) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={column.type}
                          value={item[column.key] || ""}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              column.key,
                              column.type === "number"
                                ? parseFloat(e.target.value) || 0
                                : e.target.value
                            )
                          }
                          min={column.min}
                          step={column.step}
                          required={column.required}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      )
                    ) : (
                      <span className="text-sm text-gray-900">
                        {column.key === "no" ? index + 1 : item[column.key]}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                    className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t">
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
        >
          Add Item
        </button>
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="bg-white rounded-lg border p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.paymentDetails.fields.map((field: any) => (
          <div key={field.key} className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select {field.label}</option>
                {field.options?.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTermsConditions = () => (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
      <div className="space-y-3">
        {config.termsConditions.defaultTerms.map(
          (term: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-gray-500 mt-1">•</span>
              <span className="text-gray-700">{term}</span>
            </div>
          )
        )}
      </div>
      {config.termsConditions.customTermsEnabled && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Terms
          </label>
          <textarea
            rows={4}
            placeholder="Add custom terms and conditions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );

  const renderAttachments = () => (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Attachments</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-2">
          <svg
            className="mx-auto h-12 w-12"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-2">Drop files here or click to browse</p>
        <p className="text-sm text-gray-500">
          Supported: {config.attachments.allowedTypes.join(", ")}
          (Max {config.attachments.maxFileSize}, up to{" "}
          {config.attachments.maxFiles} files)
        </p>
        <input type="file" multiple className="hidden" />
        <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
          Choose Files
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "item-details":
        return renderItemTable();
      case "payment-details":
        return renderPaymentDetails();
      case "terms-conditions":
        return renderTermsConditions();
      case "attachments":
        return renderAttachments();
      default:
        return <div>Tab content not found</div>;
    }
  };

  const handleSave = () => {
    console.log("Saving sales form:", { formData, items });
    // Handle save logic here
  };

  const handleCancel = () => {
    if (availableViews.includes("list")) {
      onViewChange("list");
    }
  };

  return (
    <div className="sales-form-view">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {config.pageConfig.heading}
          </h1>
          <p className="text-gray-600 mt-1">
            Currency: {config.pageConfig.currency}
          </p>
        </div>

        {/* Navigation */}
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

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-lg">
        {/* Form Fields */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(config.formFields).map(
              ([fieldKey, fieldConfig]: [string, any]) => (
                <div key={fieldKey} className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {fieldConfig.label}
                    {fieldConfig.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {renderFormField(fieldKey, fieldConfig)}
                </div>
              )
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {config.tabs.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
          <div className="flex gap-2">
            {config.actions.cancel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                {config.actions.cancel.label}
              </button>
            )}
            {config.actions.makeRecurring && (
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                {config.actions.makeRecurring.label}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {config.actions.save && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {config.actions.save.label}
              </button>
            )}
            {config.actions.saveAndSend && (
              <div className="relative">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  {config.actions.saveAndSend.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Views Info */}
      <div className="mt-4 text-sm text-gray-600">
        Available views: {availableViews.join(", ")}
      </div>
    </div>
  );
};

export default SalesFormView;
