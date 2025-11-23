import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/component/shadcnui/button";
import { Card } from "@/component/shadcnui/card";

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-theme px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl font-bold text-primary mb-2">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/dashboard">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
};
