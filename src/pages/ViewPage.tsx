import DynamicTabs from "@/component/layout/DynamicTabs";
// import ViewPageLayout from "@/pages/ViewPageLayout";
import Viewpagejson from "../staticjson/viewpagejson.json";
import Section from "@/component/layout/section";
const Viewpage = () => {
  const handleAction = async (action: string, url: string) => {
    try {
      console.log(`Executing action: ${action}`);

      switch (action) {
        case "add_new_record":
          window.location.href = url;
          break;
        case "import_file":
          const response = await fetch(url, { method: "POST" });
          console.log("Import response:", response);
          break;
        case "export_file":
          const exportResponse = await fetch(url);
          const blob = await exportResponse.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = "export.csv";
          a.click();
          break;
        default:
          console.log(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return (
    <div
    // title={Viewpagejson.title}
    // primaryButton={Viewpagejson.actionButtons.primary}
    // secondaryButtons={Viewpagejson.actionButtons.secondary}
    // onAction={handleAction}
    >
      {"section" === Viewpagejson?.display ? (
        <Section title={Viewpagejson.title} data={Viewpagejson} />
      ) : (
        <DynamicTabs tabs={Viewpagejson.tabs} />
      )}
    </div>
  );
};

export default Viewpage;
