import { lazy, Suspense, useMemo } from "react";
import ViewPage from "@/pages/ViewPage";
import RoleBasedDataPage from "@/pages/RoleBasedDataPage";

interface PageRendererProps {
  pageKey: string;
  pageType?: string;
}

const PageRenderer = ({ pageKey, pageType }: PageRendererProps) => {
  // Memoized lazy-loaded components
  const SalesPage = useMemo(
    () =>
      lazy(() =>
        import("@/pages/SalesPage").catch((err) => {
          console.error("Error loading SalesPage:", err);
          return { default: () => <div>Error loading SalesPage</div> };
        })
      ),
    []
  );

  const PurchasePage = useMemo(
    () =>
      lazy(() =>
        import("@/pages/purchase").catch((err) => {
          console.error("Error loading PurchasePage:", err);
          return { default: () => <div>Error loading PurchasePage</div> };
        })
      ),
    []
  );

  // Dynamic page mapping based on pageKey
  const getPageComponent = () => {
    switch (pageKey) {
      case "home":
        return RoleBasedDataPage;
      case "sales":
        return SalesPage;
      case "purchase":
        return PurchasePage;
      case "cash_bank":
        return RoleBasedDataPage;
      case "chart_of_account":
        return ViewPage;
      case "journal_entry":
        return ViewPage;
      case "audit_compliance":
        return ViewPage;
      case "vendor_invoice":
        return ViewPage;
      case "taxes":
        return ViewPage;
      case "expenses":
        return ViewPage;
      case "more":
        return ViewPage;
      default:
        return RoleBasedDataPage;
    }
  };

  const PageComponent = getPageComponent();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          Loading page...
        </div>
      }
    >
      <PageComponent />
    </Suspense>
  );
};

export default PageRenderer;
