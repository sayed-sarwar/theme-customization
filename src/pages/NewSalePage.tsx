import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/component/shadcnui/tabs";
import { ItemTable, type ItemRow } from "@/components/ItemTable";
import { Button } from "@/component/shadcnui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/component/shadcnui/dropdown-menu";
import newSalesPageConfig from "@/staticjson/newSalesPageConfig.json";

const HybridNewSalePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBreadcrumb = location.state?.fromTopbar;

  // Detect if this is a purchase or sales page based on URL
  const isPurchase = location.pathname.includes("/purchase");
  const pageType = isPurchase ? "purchase" : "sales";
  const previousUrl = location.state?.from || `/${pageType}`;

  // Use config for page titles and labels
  const config = newSalesPageConfig;
  const pageTitle = isPurchase ? "New Purchase" : config.pageConfig.title;
  const formLabel = isPurchase ? "Vendor" : config.pageConfig.formLabel;
  const pageHeading = isPurchase
    ? "Create New Purchase"
    : config.pageConfig.heading;

  const getPreviousPageName = (url: string) => {
    if (url === "/dashboard") return "Dashboard";
    if (url === "/sales") return "Sales";
    if (url === "/purchase") return "Purchase";
    if (url.startsWith("/"))
      return url.substring(1).replace("-", " ").replace("_", " ");
    return url.replace("-", " ").replace("_", " ");
  };

  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    date: "",
    status: config.formFields.status.defaultValue,
    description: "",
  });

  const [itemTableData, setItemTableData] = useState<ItemRow[]>([
    {
      id: "row-1",
      no: 1,
      category: "",
      item: "",
      quantity: config.itemTableConfig.defaultRow.quantity,
      rate: config.itemTableConfig.defaultRow.rate,
      tax: config.itemTableConfig.defaultRow.tax,
      taxPercent: config.itemTableConfig.defaultRow.taxPercent,
      amount: config.itemTableConfig.defaultRow.amount,
    },
  ]);

  const [taxInclusive] = useState(config.pageConfig.taxInclusive);
  const [currency] = useState(config.pageConfig.currency);

  // Set default date to today if configured
  useEffect(() => {
    if (config.formFields.date.defaultValue === "today") {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, date: today }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields using config
    const requiredFields = config.validation.required;
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Validate item table if required
    if (
      config.validation.itemTableRequired &&
      itemTableData.length < config.validation.minItems
    ) {
      alert("Please add at least one item to the table");
      return;
    }

    console.log("New sale created:", formData, itemTableData);
    alert(config.notifications.success);
    navigate(`/${pageType}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {showBreadcrumb && (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <button
            onClick={() => navigate(previousUrl)}
            className="hover:opacity-80 capitalize"
            style={{ color: "var(--Primary-Color, hsla(152, 96%, 33%, 1))" }}
          >
            {getPreviousPageName(previousUrl)}
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{pageTitle}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{pageHeading}</h1>
        <button
          onClick={() => navigate(`/${pageType}`)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.formFields.customer.label}
              {config.formFields.customer.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type={config.formFields.customer.type}
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              placeholder={config.formFields.customer.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={config.formFields.customer.required}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.formFields.amount.label}
              {config.formFields.amount.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type={config.formFields.amount.type}
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder={config.formFields.amount.placeholder}
              min={config.formFields.amount.validation.min}
              max={config.formFields.amount.validation.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={config.formFields.amount.required}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.formFields.date.label}
              {config.formFields.date.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type={config.formFields.date.type}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={config.formFields.date.required}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.formFields.status.label}
              {config.formFields.status.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={config.formFields.status.required}
            >
              {config.formFields.status.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.formFields.description.label}
              {config.formFields.description.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={config.formFields.description.rows}
              placeholder={config.formFields.description.placeholder}
              maxLength={config.formFields.description.validation.maxLength}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={config.formFields.description.required}
            />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow mb-5">
        <Tabs
          defaultValue={
            config.tabs.find((tab) => tab.active)?.id || "item-details"
          }
          className="w-full"
        >
          <TabsList className="w-full justify-start border-b">
            {config.tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="item-details" className="p-6">
            <ItemTable
              data={itemTableData}
              onDataChange={setItemTableData}
              taxInclusive={taxInclusive}
              currency={currency}
            />
          </TabsContent>

          <TabsContent value="payment-details" className="p-6">
            <div className="space-y-4">
              {config.paymentDetails.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="terms-conditions" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Terms and Conditions
              </h3>
              <div className="space-y-2">
                {config.termsConditions.defaultTerms.map((term, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-sm text-gray-500 mt-1">
                      {index + 1}.
                    </span>
                    <p className="text-sm text-gray-700">{term}</p>
                  </div>
                ))}
              </div>
              {config.termsConditions.customTermsEnabled && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Terms
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add custom terms and conditions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="p-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats:{" "}
                  {config.attachments.allowedTypes.join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  Max file size: {config.attachments.maxFileSize}, Max files:{" "}
                  {config.attachments.maxFiles}
                </p>
                <input
                  type="file"
                  multiple
                  accept={config.attachments.allowedTypes.join(",")}
                  className="hidden"
                />
                <Button className="mt-4" variant="outline">
                  Choose Files
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-6 flex gap-3 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {config.actions.cancel.label}{" "}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {config.actions.makeRecurring.enabled && (
          <Button
            onClick={() => {
              alert(config.notifications.recurring);
            }}
            style={{
              backgroundColor: "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
            }}
            className="text-white hover:opacity-90"
          >
            {config.actions.makeRecurring.label}
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          style={{
            backgroundColor: "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
          }}
          className="text-white hover:opacity-90"
        >
          {config.actions.save.label}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              style={{ backgroundColor: "hsla(152, 96%, 28%, 1)" }}
              className="text-white hover:opacity-90"
            >
              {config.actions.saveAndSend.label}{" "}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HybridNewSalePage;
