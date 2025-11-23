const CardItem = (props: any) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="list-i border-b border-gray-300 pb-3 c-sp">
        <div className="f-one text-sm font-semibold text-gray-700 mb-1">
          {props.dataItem.name || 'Unnamed Item'}
        </div>
        <div className="f-two text-base text-gray-900">
          {props.dataItem.active || props.dataItem.value || 'No value'}
        </div>
        {props.dataItem.description && (
          <div className="text-xs text-gray-500 mt-2">
            {props.dataItem.description}
          </div>
        )}
        {props.dataItem.editable && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Editable
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardItem;
