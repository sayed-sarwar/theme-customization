import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchData } from "../store/usermedata/usermedata";
import { AuthProvider } from "./context/AuthContext";
import Viewpage from "./pages/ViewPage";
import Layout from "./layout/MainLayout";

const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData() as any);
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <>
          <Layout>
            <Viewpage />
          </Layout>
          {/* <RootRoute /> */}
        </>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
