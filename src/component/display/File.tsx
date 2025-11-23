import { Input } from "../shadcnui/input";

const File = (props: any) => {
  return <Input type="file" onChange={props.handleChange} />;
};

export default File;
