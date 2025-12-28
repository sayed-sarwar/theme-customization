import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchData } from "../store/usermedata/usermedata";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";
import Toast from "./components/Toast";
import RootRoute from "./routes/Route";

const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData() as any);
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toast />
            <RootRoute />
          </AuthProvider>
        </LanguageProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
