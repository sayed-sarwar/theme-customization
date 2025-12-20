import * as React from "react";
import type { FC } from "react";
interface PageProps {
  menuItem?: any;
}

const Page: FC<PageProps> = ({ menuItem }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{menuItem?.label || "Page"}</h1>
      <p className="text-gray-600">
        This is a dynamic page for: {menuItem?.label}
      </p>
    </div>
  );
};

export default Page;
