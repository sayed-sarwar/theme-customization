import { useParams } from "react-router-dom";
import PageRenderer from "./PageRenderer";
import { usePageConfig } from "../../config/usePageConfig";

const DynamicPage = () => {
  const { model, view, id } = useParams();
  console.log("DynamicPage params:", { model, view, id });

  const pageConfig = usePageConfig(model!);
  if (!pageConfig) return <div>Loading...</div>;

  const viewConfig = pageConfig.views?.[view!];
  if (!viewConfig) return <div>View not found</div>;

  return <PageRenderer config={viewConfig} id={id} />;
};

export default DynamicPage;
