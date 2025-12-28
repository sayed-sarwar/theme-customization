import Topbar from "./Topbar";
import LeftSidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { Suspense } from "react";

const Layout = (props: any) => {
  const location = useLocation();

  // Only hide sidebar for specific pages like new/edit sales
  const hideSidebar =
    location.pathname === "/sales/new" ||
    location.pathname.startsWith("/sales/edit");

  console.log(
    "[Layout] Current path:",
    location.pathname,
    "Hide sidebar:",
    hideSidebar
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="flex">
        {!hideSidebar && <LeftSidebar />}
        <main className="flex-1 p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-3 text-gray-600 text-sm">
                    Loading page content...
                  </p>
                </div>
              </div>
            }
          >
            {props.children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
