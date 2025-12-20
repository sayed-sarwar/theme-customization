interface GridViewProps<T> {
  data: T[];
}

export function GridView<T>({ data }: GridViewProps<T>) {
  const style = {
    fontSize: "18px",
    fontWeight: "400",
  };
  return (
    <div className="w-4/6">
      {data.map((item: any, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3  p-2 ">
          {Object.entries(item).map(([key, value]) => (
            <div
              key={key}
              style={{
                marginBottom: "8px",
                // fontSize: style.fontSize,
                fontWeight: style.fontWeight,
              }}
            >
              <strong>{key}:</strong> {String(value)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
