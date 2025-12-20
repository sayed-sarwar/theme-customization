interface KanbanViewProps<T> {
  data: T[];
}

export function KanbanView<T>({ data }: KanbanViewProps<T>) {
  const statusColumns = ['pending', 'in-progress', 'completed'];
  
  const groupedData = statusColumns.reduce((acc, status) => {
    acc[status] = data.filter((item: any) => item.status === status);
    return acc;
  }, {} as Record<string, T[]>);

  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
      {statusColumns.map(status => (
        <div
          key={status}
          style={{
            minWidth: '300px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <h3 style={{ marginBottom: '16px', textTransform: 'capitalize' }}>
            {status.replace('-', ' ')} ({groupedData[status]?.length || 0})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {groupedData[status]?.map((item: any, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {Object.entries(item).map(([key, value]) => (
                  key !== 'status' && (
                    <div key={key} style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>{key}:</strong> {String(value)}
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}