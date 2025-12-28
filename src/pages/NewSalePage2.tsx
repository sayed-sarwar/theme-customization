import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/component/shadcnui/tabs";
import { ItemTable, type ItemRow } from "@/components/ItemTable";
import { Button } from "@/component/shadcnui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/component/shadcnui/dropdown-menu";

const NewSalePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBreadcrumb = location.state?.fromTopbar;
  const previousUrl = location.state?.from || '/sales';
  
  const getPreviousPageName = (url: string) => {
    if (url === '/dashboard') return 'Dashboard';
    if (url === '/sales') return 'Sales';
    if (url.startsWith('/')) return url.substring(1).replace('-', ' ').replace('_', ' ');
    return url.replace('-', ' ').replace('_', ' ');
  };
  
  const [formData, setFormData] = useState({
    customer: "",
    date: "",
    status: "Pending",
    description: "",
  });

  const [itemTableData, setItemTableData] = useState<ItemRow[]>([
    {
      id: "row-1",
      no: 1,
      category: "",
      item: "",
      quantity: 0,
      rate: 0,
      tax: "",
      taxPercent: 0,
      amount: 0,
    },
  ]);

  const [taxInclusive] = useState(false);
  const [currency] = useState("BDT");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New sale created:", formData, itemTableData);
    navigate("/sales");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {showBreadcrumb && (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <button 
            onClick={() => navigate(previousUrl)}
            className="hover:opacity-80 capitalize"
            style={{ color: 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' }}
          >
            {getPreviousPageName(previousUrl)}
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">New Sale</span>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Sale</h1>
        <button
          onClick={() => navigate("/sales")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="item-details" className="w-full">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="item-details">Item Details</TabsTrigger>
            <TabsTrigger value="other-details">Other Details</TabsTrigger>
            <TabsTrigger value="payment-details">Payment Details</TabsTrigger>
            <TabsTrigger value="terms-conditions">Terms and Conditions</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>

          <TabsContent value="item-details" className="p-6">
            <ItemTable
              data={itemTableData}
              onDataChange={setItemTableData}
              taxInclusive={taxInclusive}
              currency={currency}
            />
          </TabsContent>

          <TabsContent value="other-details" className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </TabsContent>

          <TabsContent value="payment-details" className="p-6">
            <div className="space-y-4">
              <p className="text-gray-600">Payment details will be added here.</p>
            </div>
          </TabsContent>

          <TabsContent value="terms-conditions" className="p-6">
            <div className="space-y-4">
              <p className="text-gray-600">Terms and conditions will be added here.</p>
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="p-6">
            <div className="space-y-4">
              <p className="text-gray-600">Attachments will be added here.</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t p-6 flex gap-3 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Cancel <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <Button
            onClick={() => {
              // Handle recurring
            }}
            style={{ backgroundColor: 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' }}
            className="text-white hover:opacity-90"
          >
            Make Recurring
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' }}
            className="text-white hover:opacity-90"
          >
            Save
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                style={{ backgroundColor: 'hsla(152, 96%, 28%, 1)' }}
                className="text-white hover:opacity-90"
              >
                Save and Send <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NewSalePage;