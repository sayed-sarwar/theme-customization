export const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">401</h1>
        <p className="text-xl text-gray-600 mt-4">Unauthorized Access</p>
        <p className="text-gray-500 mt-2">You don't have permission to access this resource.</p>
      </div>
    </div>
  );
};