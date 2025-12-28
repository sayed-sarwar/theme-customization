import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/component/shadcnui/button";

type PurchaseOrder = {
  id: number;
  orderDate: string;
  customerName: string;
  orderNo: string;
  supplier: string;
  location: string;
  totalTax: number;
  totalAmount: number;
  status: "Open" | "In Process" | "Completed";
};

// Mock data - in real app, fetch from API based on ID
const mockData: PurchaseOrder[] = [
  {
    id: 1,
    orderDate: "March 12, 2025",
    customerName: "Lynx",
    orderNo: "12214356",
    supplier: "Amazon",
    location: "Mirpur",
    totalTax: 34.0,
    totalAmount: 12005.0,
    status: "Open",
  },
  {
    id: 2,
    orderDate: "March 13, 2025",
    customerName: "Bamboo Bears",
    orderNo: "12214357",
    supplier: "eBay",
    location: "Dhanmondi",
    totalTax: 45.0,
    totalAmount: 20010.0,
    status: "In Process",
  },
  {
    id: 3,
    orderDate: "March 15, 2025",
    customerName: "Eagles",
    orderNo: "12214359",
    supplier: "Flipkart",
    location: "Uttara",
    totalTax: 23.0,
    totalAmount: 3000.0,
    status: "Completed",
  },
];

const getStatusDotColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-500";
    case "In Process":
      return "bg-orange-500";
    case "Completed":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700";
    case "In Process":
      return "bg-orange-100 text-orange-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ViewOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detect if this is purchase or sales
  const isPurchase = location.pathname.includes("/purchase");
  const pageType = isPurchase ? "purchase" : "sales";
  const pageTitle = isPurchase ? "Purchase Order" : "Sales Order";
  
  // Find the order data - in real app, fetch from API
  const order = mockData.find((item) => item.id === parseInt(id || "0"));

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`/${pageType}/list`)}>
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `TK ${amount.toFixed(2)}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/${pageType}/list`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle} Details</h1>
            <p className="text-sm text-gray-500 mt-1">Order #{order.orderNo}</p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/${pageType}/edit/${id}`)}
          style={{
            backgroundColor: "var(--Primary-Color, hsla(152, 96%, 33%, 1))",
          }}
          className="text-white hover:opacity-90"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-lg shadow border-2 border-blue-200">
        <div className="p-6">
          <div className="grid grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Date
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {order.orderDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Supplier
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {order.supplier}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Total tax
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {formatCurrency(order.totalTax)}
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Customer Name
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {order.customerName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium ${getStatusBgColor(
                      order.status
                    )}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${getStatusDotColor(
                        order.status
                      )}`}
                    />
                    {order.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Total Amount
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Order No
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {order.orderNo}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Location
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {order.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderPage;

