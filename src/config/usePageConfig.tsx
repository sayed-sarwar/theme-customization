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
// import purchaseOrderConfig from "@/config/purchase_order.json";

const CONFIG_MAP: Record<string, any> = {
  sales_order: salesOrderConfig,
  purchage_order: purchaseOrderConfig
};

export const usePageConfig = (model: string) => {
  return CONFIG_MAP[model];
};
