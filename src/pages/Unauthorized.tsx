import { Button } from "../component/shadcnui/button";
import { Card } from "../component/shadcnui/card";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this resource.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Go Back to Dashboard
        </Button>
      </Card>
    </div>
  );
};
