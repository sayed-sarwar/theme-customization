import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import menuData from "@/staticjson/data1.json";
import PageRenderer from "@/components/PageRenderer";
import { Unauthorized } from "@/pages/Unauthorized";
import DynamicModulePage from "@/pages/DynamicModulePage";

import NewSalePage from "@/pages/NewSalePage";
import EditSalePage from "@/pages/EditSalePage";

const RoleBasedPages = () => {
  const { user } = useAuth();

  const hasAccess = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  const renderRoutes = (items: any[], parentPath = ""): any[] => {
    return items.map((item) => {
      if (!hasAccess(item.roles)) return null;

      const fullPath = item.route?.replace("/", "") || item.key;

      if (item.children) {
        return renderRoutes(item.children, fullPath);
      }

      return (
        <Route
          key={item.key}
          path={fullPath}
          element={<PageRenderer pageKey={item.key} pageType={item.type} />}
        />
      );
    });
  };

  return (
    <Routes>
      <Route path="sales/new" element={<NewSalePage />} />
      <Route path="sales/edit/:id" element={<EditSalePage />} />
      <Route path="modules/:moduleSlug/:subView?" element={<DynamicModulePage />} />
      {renderRoutes(menuData)}
      <Route path="*" element={<Unauthorized />} />
    </Routes>
  );
};

export default RoleBasedPages;
