import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import PageRenderer from "./PageRenderer";
import { usePageConfig } from "../../config/usePageConfig";

const DynamicPage = () => {
  const { model, view, id } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState(view || "list");

  console.log("DynamicPage params:", { model, view, id });

  const pageConfig = usePageConfig(model!);
  if (!pageConfig) return <div>Loading...</div>;

  // Handle different config structures
  let viewConfig;
  let availableViews: string[] = [];

  if (pageConfig.views) {
    // Standard multi-view configuration
    viewConfig = pageConfig.views[activeView];
    availableViews = Object.keys(pageConfig.views);
  } else if (pageConfig.pageConfig) {
    // newSalesPageConfig.json structure - treat as single form view
    viewConfig = {
      component: "SalesFormView",
      ...pageConfig,
    };
    availableViews = ["create"]; // Single view
    setActiveView("create");
  } else {
    return <div>Invalid configuration structure</div>;
  }

  if (!viewConfig) return <div>View not found: {activeView}</div>;

  const handleViewChange = (newView: string) => {
    setActiveView(newView);
    // Update URL without page reload
    const newPath = id ? `/${model}/${newView}/${id}` : `/${model}/${newView}`;
    navigate(newPath, { replace: true });
  };

  return (
    <div className="dynamic-page">
      {/* View Selector - only show if multiple views available */}
      {availableViews.length > 1 && (
        <div className="view-selector mb-4">
          <div className="flex gap-2 border-b">
            {availableViews.map((viewName) => (
              <button
                key={viewName}
                onClick={() => handleViewChange(viewName)}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeView === viewName
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Render the active view */}
      <PageRenderer
        config={viewConfig}
        model={model!}
        view={activeView}
        id={id}
        onViewChange={handleViewChange}
        availableViews={availableViews}
      />
    </div>
  );
};

export default DynamicPage;
