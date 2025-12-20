import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRoleBasedMenu } from "@/hooks/useRoleBasedMenu";
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
  Home,
  ShoppingBag,
  Wallet,
  Percent,
} from "lucide-react";
// import data from "../../data1.json";

const iconMap: { [key: string]: any } = {
  home: Home,
  "shopping-cart": ShoppingCart,
  "shopping-bag": ShoppingBag,
  "dollar-sign": DollarSign,
  wallet: Wallet,
  percent: Percent,
  "file-text": FileText,
  "more-horizontal": MoreHorizontal,
  LayoutDashboard,
  GitBranch,
  CreditCard,
  Banknote,
  Calculator,
  Receipt,
  ArrowLeftRight,
  Archive,
};

const LeftSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["account"]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const { menuItems, userRole } = useRoleBasedMenu();
  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (url: string) => location.pathname === url;

  const renderNavItem = (item: any, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key || item.id);
    const paddingLeft = isCollapsed ? '12px' : `${(level + 1) * 16}px`;
    const isHovered = hoveredItem === (item.key || item.id);

    return (
      <div 
        key={item.key || item.id} 
        className="mb-1 relative"
        data-item-id={item.key || item.id}
        onMouseEnter={() => isCollapsed && hasChildren && setHoveredItem(item.key || item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {(item.url || item.route) ? (
          <Link
            to={item.url || item.route}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive(item.url || item.route)
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
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {hasChildren && !isCollapsed && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleExpanded(item.key || item.id);
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
            onClick={() => hasChildren && toggleExpanded(item.key || item.id)}
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
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {hasChildren && !isCollapsed &&
              (isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ))}
          </button>
        )}

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children.map((child: any) => renderNavItem(child, level + 1))}
          </div>
        )}

        {item.page && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.page.map((page: any) => renderNavItem(page, level + 1))}
          </div>
        )}

        {/* Hover submenu for collapsed sidebar */}
        {isCollapsed && hasChildren && isHovered && (
          <div 
            className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-48" 
            style={{
              left: '64px',
              top: `${(document.querySelector(`[data-item-id="${item.key || item.id}"]`) as HTMLElement)?.offsetTop || 0}px`,
              zIndex: 9999
            }}
            data-submenu={item.key || item.id}
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
              {item.label}
            </div>
            {item.children?.map((child: any) => (
              <Link
                key={child.key || child.id}
                to={child.url || child.route}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {child.icon && iconMap[child.icon] && (
                  React.createElement(iconMap[child.icon], {
                    className: "h-4 w-4 mr-3",
                  })
                )}
                <span>{child.label}</span>
              </Link>
            ))}
            {item.page?.map((page: any) => (
              <Link
                key={page.key || page.id}
                to={page.url || page.route}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {page.icon && iconMap[page.icon] && (
                  React.createElement(iconMap[page.icon], {
                    className: "h-4 w-4 mr-3",
                  })
                )}
                <span>{page.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded"
        >
          <Building2 className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {!isCollapsed && (
          <div className="mb-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
            Role: <span className="font-semibold">{userRole}</span>
          </div>
        )}
        <nav className="space-y-2">
          {menuItems
            .filter((item: any) => item.key !== "dashboard")
            .map((item: any) => renderNavItem(item))}
        </nav>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2024 Mukut Solutions
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
// src/components/Sidebar.tsx
// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { ChevronDown, ChevronRight } from "lucide-react"; // for arrows
// import { sidebarMenu } from "../layout/menudata";

// export default function Sidebar() {
//   // Track open/closed state for menu groups (using label or index as key)
//   const [openGroups, setOpenGroups] = useState<string[]>([]);

//   const toggleGroup = (label: string) => {
//     setOpenGroups((prev) =>
//       prev.includes(label)
//         ? prev.filter((item) => item !== label)
//         : [...prev, label]
//     );
//   };

//   const isGroupOpen = (label: string) => openGroups.includes(label);

//   return (
//     <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
//       <div className="p-4 text-xl font-bold border-b border-gray-700">
//         Mukut App
//       </div>

//       <nav className="mt-4">
//         {sidebarMenu.map((item, index) => {
//           const key = item.path || item.label || index;

//           // If item has subItems → treat as collapsible group
//           if (item.subItems) {
//             const open = isGroupOpen(item.label);

//             return (
//               <div key={key} className="mb-1">
//                 {/* Group Header (clickable to toggle) */}
//                 <div
//                   onClick={() => toggleGroup(item.label)}
//                   className="flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 cursor-pointer rounded-md mx-2"
//                 >
//                   <div className="flex items-center">
//                     <item.icon className="w-5 h-5 mr-3" />
//                     <span>{item.label}</span>
//                   </div>
//                   {open ? (
//                     <ChevronDown className="w-4 h-4" />
//                   ) : (
//                     <ChevronRight className="w-4 h-4" />
//                   )}
//                 </div>

//                 {/* Sub-menu items - conditionally rendered */}
//                 {open && (
//                   <div className="ml-6 border-l border-gray-700">
//                     {item.subItems.map((sub) => (
//                       <NavLink
//                         key={sub.path}
//                         to={sub.path}
//                         className={({ isActive }) =>
//                           `flex items-center px-4 py-2 text-sm rounded-md mx-2 my-1 ${
//                             isActive
//                               ? "bg-gray-700 text-white font-medium"
//                               : "text-gray-400 hover:bg-gray-800"
//                           }`
//                         }
//                       >
//                         <sub.icon className="w-4 h-4 mr-3" />
//                         <span>{sub.label}</span>
//                       </NavLink>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           }

//           // Regular menu item (no subItems)
//           return (
//             <NavLink
//               key={key}
//               to={item.path!}
//               className={({ isActive }) =>
//                 `flex items-center px-4 py-3 mx-2 rounded-md ${
//                   isActive
//                     ? "bg-gray-700 text-white font-medium"
//                     : "text-gray-300 hover:bg-gray-800"
//                 }`
//               }
//             >
//               <item.icon className="w-5 h-5 mr-3" />
//               <span>{item.label}</span>
//             </NavLink>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }
