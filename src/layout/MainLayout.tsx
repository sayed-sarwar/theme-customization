// import { Outlet } from "react-router-dom";
import TopBar from "./Topbar";
import LeftSidebar from "./Sidebar";

const Layout = (props: any) => {
  return (
    <div className="flex h-screen bg-theme">
      {/* Left Sidebar */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* <Outlet /> */}
            {props.children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
