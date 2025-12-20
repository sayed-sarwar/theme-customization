import { useParams } from "react-router-dom";
import PageRenderer from "@/components/PageRenderer";

const DynamicModulePage = () => {
  const { moduleSlug, subView } = useParams<{
    moduleSlug: string;
    subView?: string;
  }>();

  return (
    <PageRenderer 
      pageKey={moduleSlug || ""} 
      pageType="module"
      subView={subView}
    />
  );
};

export default DynamicModulePage;