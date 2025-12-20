import Topbar from "./Topbar";
import LeftSidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { Suspense } from "react";

const Layout = (props: any) => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/sales/new' || location.pathname.startsWith('/sales/edit');

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="flex">
        {!hideSidebar && <LeftSidebar />}
        <main className="flex-1 p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          }>
            {props.children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
