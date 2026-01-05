import ListView from "./views/ListView";
import FormView from "./views/FormView";
import DetailView from "./views/DetailView";
import SalesFormView from "./views/SalesFormView";

const COMPONENT_MAP = {
  ListView,
  FormView,
  DetailView,
  SalesFormView,
};

interface PageConfig {
  component: keyof typeof COMPONENT_MAP;
  permissions?: string[];
  api?: string;
  [key: string]: any; // Allow additional config properties
}

interface PageRendererProps {
  config: PageConfig;
  model: string;
  view: string;
  id?: string;
  onViewChange: (view: string) => void;
  availableViews: string[];
}

const PageRenderer = ({
  config,
  model,
  view,
  id,
  onViewChange,
  availableViews,
}: PageRendererProps) => {
  const Component = COMPONENT_MAP[config.component];
  console.log("Component", Component);
  if (!Component) {
    return (
      <div className="error-message p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-semibold">Component not registered</h3>
        <p className="text-red-600">
          Component "{config.component}" is not available.
        </p>
        <p className="text-sm text-red-500 mt-2">
          Available components: {Object.keys(COMPONENT_MAP).join(", ")}
        </p>
      </div>
    );
  }

  // Pass all necessary props to the component
  return (
    <Component
      config={config}
      model={model}
      view={view}
      id={id}
      onViewChange={onViewChange}
      availableViews={availableViews}
    />
  );
};

export default PageRenderer;
