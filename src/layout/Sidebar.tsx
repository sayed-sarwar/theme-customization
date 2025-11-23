import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import datas from "../staticjson/data1.json";
import {
  ChevronDown,
  ChevronRight,
  Building2,
  LayoutDashboard,
  GitBranch,
  ShoppingCart,
  FileText,
  CreditCard,
  Banknote,
  Calculator,
  Receipt,
  DollarSign,
  ArrowLeftRight,
  MoreHorizontal,
  Archive,
} from "lucide-react";
// import data from "../../data1.json";

const iconMap: { [key: string]: any } = {
  LayoutDashboard,
  GitBranch,
  ShoppingCart,
  FileText,
  CreditCard,
  Banknote,
  Calculator,
  Receipt,
  DollarSign,
  ArrowLeftRight,
  MoreHorizontal,
  Archive,
};

const LeftSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["accounting"]);
  const location = useLocation();
  const data: any = datas; // Replace with actual data import or prop
  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (url: string) => location.pathname === url;

  const renderNavItem = (item: any, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const paddingLeft = `${(level + 1) * 16}px`;

    return (
      <div key={item.id} className="mb-1">
        {item.url ? (
          <Link
            to={item.url}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive(item.url)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            style={{ paddingLeft }}
          >
            <div className="flex items-center space-x-3">
              {item.icon && iconMap[item.icon] ? (
                React.createElement(iconMap[item.icon], {
                  className: "h-5 w-5",
                })
              ) : (
                <div className="h-5 w-5 bg-gray-300 rounded" />
              )}
              <span>{item.label}</span>
            </div>
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleExpanded(item.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
          </Link>
        ) : (
          <button
            onClick={() => hasChildren && toggleExpanded(item.id)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            style={{ paddingLeft }}
          >
            <div className="flex items-center space-x-3">
              {item.icon && iconMap[item.icon] ? (
                React.createElement(iconMap[item.icon], {
                  className: "h-5 w-5",
                })
              ) : (
                <div className="h-5 w-5 bg-gray-300 rounded" />
              )}
              <span>{item.label}</span>
            </div>
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ))}
          </button>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map((child: any) => renderNavItem(child, level + 1))}
          </div>
        )}

        {item.page && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.page.map((page: any) => renderNavItem(page, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {data.navigation
            .filter((item: any) => item.id !== "dashboard")
            .map((item: any) => renderNavItem(item))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Mukut Solutions
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
