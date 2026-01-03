/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, Route } from "react-router-dom";
import PageRenderer from "@/components/PageRenderer";
import { NotFound } from "@/pages/NotFound";
import menuData from "@/staticjson/data1.json";

// import NewSalePage from "@/pages/NewSalePage";
// import EditSalePage from "@/pages/EditSalePage";
// import ListPage from "@/pages/ListPage";
// import SalesPage from "@/pages/SalesPage";
// import Purchase from "@/pages/purchase";
// import ViewOrderPage from "@/pages/ViewOrderPage";
import DynamicPage from "@/pages/dynamicpage/dynamicpage";
import Page from "@/pages/page";

const RoleBasedPages = () => {
  const renderRoutes = (items: any[]): any[] => {
    return items.map((item) => {
      const fullPath = item.route?.replace("/", "") || item.key;

      if (item.children) {
        return renderRoutes(item.children);
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
      
      <Route path="chart-of-account" element={<Page />} />
      <Route path="accounts" element={<Page />} />

  
      {/* <Route path="sales" element={<SalesPage />} />
      <Route path="sales/new" element={<NewSalePage />} />
      <Route path="sales/list" element={<ListPage />} />
      <Route path="sales/view/:id" element={<ViewOrderPage />} />
      <Route path="sales/edit/:id" element={<EditSalePage />} />

 
      <Route path="purchase/new" element={<NewSalePage />} />
      <Route path="purchase/list" element={<ListPage />} />
      <Route path="purchase/view/:id" element={<ViewOrderPage />} />
      <Route path="purchase/edit/:id" element={<EditSalePage />} />

   
      <Route path="purchase" element={<Purchase />} /> */}
      <Route path="/app/:model/:view" element={<DynamicPage />} />
      <Route path="/app/:model/:view/:id" element={<DynamicPage />} />


      {/* Dynamic routes from menu data */}
      {renderRoutes(menuData)}

      {/* Catch all - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoleBasedPages;
