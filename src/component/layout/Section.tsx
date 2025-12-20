import { useState } from "react";
import SubSection from "./subsection";
import Componentviewer from "../componentselector/componentselector";
import DataExample from "@/pages/DataExample";

const Section = (props: any) => {
  console.log("Section props:", props);
  const [isOpen, setIsOpen] = useState(true);

  const handleAdd = () => {
    console.log("Add clicked");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "▼" : "▶"}</button>
        <span>{props.title || "Section"}</span>
      </div>
      {isOpen && (
        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
          {/* <Componentviewer data={props.data} />
          <SubSection title="SubSection Example"></SubSection> */}
          <DataExample />
        </div>
      )}
    </div>
  );
};
export default Section;
