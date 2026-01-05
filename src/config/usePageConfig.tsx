// import { useState, useEffect } from "react";

// export const usePageConfig = (model: string) => {
//   const [config, setConfig] = useState(null);

//   useEffect(() => {
//     fetch(`/api/page-config/${model}`)
//       .then(res => res.json())
//       .then(setConfig);
//   }, [model]);

//   return config;
// };

import salesOrderConfig from "@/config/sales_order.json";
import purchaseOrderConfig from "@/config/purchase_order.json";
import exampleMultiViewConfig from "@/config/example_multi_view.json";
import newSalesPageConfig from "@/config/newSalesPageConfig.json";

const CONFIG_MAP: Record<string, any> = {
  sales_order: salesOrderConfig,
  purchase_order: purchaseOrderConfig, // Fixed typo
  product: exampleMultiViewConfig,
  new_sales: newSalesPageConfig,
};

export const usePageConfig = (model: string) => {
  return CONFIG_MAP[model];
};
