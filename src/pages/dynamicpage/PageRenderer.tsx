import ListView from "./views/ListView";
import FormView from "./views/FormView";
import DetailView from "./views/DetailView";

const COMPONENT_MAP = {
  ListView,
  FormView,
  DetailView,
};

interface PageConfig {
  component: keyof typeof COMPONENT_MAP;
  // Add other config properties here as needed
}

interface PageRendererProps {
  config: PageConfig;
  id?: string | number;
}

const PageRenderer = ({ config, id }: PageRendererProps) => {
  const Component = COMPONENT_MAP[config.component];
  if (!Component) return <div>Component not registered</div>;

  return <Component />;
};

export default PageRenderer;
