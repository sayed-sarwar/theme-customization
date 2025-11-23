const ListItemEditIcon = (props: any) => {
  return (
    <li className="flex justify-between gap-x-10 p-5">
      <div className="flex min-w-0 gap-x-6">
        <div className="min-w-0 flex-auto">
          <p className="text-sm/6 font-semibold text-gray-900">
            {props.dataItem.name /* Accessing name property from dataItem */}
          </p>
          <p className="mt-1 truncate text-xs/5 text-gray-500">
            leslie.alexander@example.com
          </p>
        </div>
      </div>
    </li>
  );
};

export default ListItemEditIcon;
