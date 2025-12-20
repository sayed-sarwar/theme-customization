import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";

const EditSalePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    date: "",
    status: "Pending",
    description: "",
  });

  useEffect(() => {
    // Mock data loading based on ID
    const mockSale = {
      customer: "ABC Corp",
      amount: "15000",
      date: "2024-01-15",
      status: "Paid",
      description: "Sample sale description",
    };
    setFormData(mockSale);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sale updated:", formData);
    navigate("/sales");
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button 
          onClick={() => navigate("/sales")}
          className="hover:opacity-80"
          style={{ color: 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' }}
        >
          Sales
        </button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Edit Sale #{id}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Sale #{id}</h1>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' } as React.CSSProperties}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' } as React.CSSProperties}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' } as React.CSSProperties}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' } as React.CSSProperties}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' } as React.CSSProperties}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: 'var(--Primary-Color, hsla(152, 96%, 33%, 1))' }}
            >
              Update Sale
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

export default EditSalePage;