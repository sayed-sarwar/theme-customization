import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/layout/MainLayout";
import { Login } from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import { NotFound } from "@/pages/NotFound";
import { Unauthorized } from "@/pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedPages from "./RoleBasedPages";
import type { ReactNode } from "react";

const RootRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  const renderProtectedRoute = (element: ReactNode) => (
    <ProtectedRoute>
      <Layout>{element}</Layout>
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/"
        element={renderProtectedRoute(<Navigate to="/dashboard" replace />)}
      />

      <Route path="/dashboard" element={renderProtectedRoute(<Dashboard />)} />

      <Route path="/*" element={renderProtectedRoute(<RoleBasedPages />)} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RootRoute;
