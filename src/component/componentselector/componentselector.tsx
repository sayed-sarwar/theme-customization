import SectionComponent from "../layout/section";
import DynamicTabs from "../layout/DynamicTabs";
import Fieldcollection from "../display/FieldCollection";
import DataTableDemo from "../display/Table";
import DataTableEntry from "../display/DataTableEntry";
import DataTableView from "../display/DataTableView";
import List from "../display/ListItemEditIcon";
import File from "../display/File";

const Componentviewer = (props: any) => {
  const getContent = (viewType: string, data: any) => {
    switch (viewType) {
      case "tabs":
        return <DynamicTabs tabs={Array.isArray(data) ? data : [data]} />;
      case "card":
        return <Fieldcollection dataItem={data} />;
      case "table":
        return <DataTableDemo data={Array.isArray(data) ? data : [data]} />;
      case "tableentry":
        return <DataTableEntry />;
      case "tableview":
        return <DataTableView />;
      case "list":
        return <List dataItem={data} />;
      case "file":
        return <File />;
      default:
        return (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Unknown view type: {viewType}</p>
            <p className="text-sm text-gray-400 mt-2">
              Available types: Tab, card, table, tableentry, tableview, list,
              file, section, Accordion
            </p>
          </div>
        );
    }
  };

  return <div>{getContent(props.data.display, props.data)}</div>;
};

export default Componentviewer;
