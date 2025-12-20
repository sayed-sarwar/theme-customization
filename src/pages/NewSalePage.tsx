import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";

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
    amount: "",
    date: "",
    status: "Pending",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New sale created:", formData);
    navigate("/sales");
  };

  return (
    <div className="p-6">
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

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' }}
            >
              Create Sale
            </button>
            <button
              type="button"
              onClick={() => navigate("/sales")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSalePage;