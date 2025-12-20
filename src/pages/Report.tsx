import { FC } from "react";

interface ReportProps {
  menuItem?: any;
}

const Report: FC<ReportProps> = ({ menuItem }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {menuItem?.label || "Report"}
        </h2>
        <p className="text-gray-600 mb-4">
          Generate and view reports for your business data.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span>Sales Report</span>
            <button className="text-blue-600 hover:underline">View</button>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Financial Report</span>
            <button className="text-blue-600 hover:underline">View</button>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Inventory Report</span>
            <button className="text-blue-600 hover:underline">View</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;