// import { Routes, Route, Navigate } from "react-router-dom";
// import type { Key } from "react";
// import { generateRoutes } from "./generateRoutes";
// import { PrivateRoute } from "@/pages/auth/PrivateRoute";
// import { PublicRoute } from "@/pages/auth/PublicRoute";
// // import { Login } from "@/pages/login";
// // import { Unauthorized } from "@/pages/unauthorized";
// // import { NotFound } from "@/pages/notFound";
// import Layout from "@/layout/mainlayout";
// import { useAuth } from "@/context/AuthContext";
// // import data from "../../data1.json";

// const RootRedirect = () => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         Loading...
//       </div>
//     );
//   }

//   return isAuthenticated ? (
//     <Navigate to="/dashboard" replace />
//   ) : (
//     <Navigate to="/login" replace />
//   );
// };

// export default function RootRoute() {
//   const dynamicRoutes = generateRoutes(data);

//   return (
//     <Routes>
//       {/* Root Route Redirect */}
//       <Route path="/" element={<RootRedirect />} />

//       {/* Public Routes */}
//       <Route
//         path="/login"
//         element={
//           <PublicRoute restricted>
//             <Login />
//           </PublicRoute>
//         }
//       />
//       <Route path="/unauthorized" element={<Unauthorized />} />

//       {/* Dynamic Routes */}
//       {dynamicRoutes.map(
//         (
//           route: {
//             component: any;
//             path: string | undefined;
//             menuItem?: any;
//             isPrivate?: boolean;
//           },
//           i: Key | null | undefined
//         ) => {
//           const Component = route.component;

//           const element = <Component menuItem={route.menuItem} />;

//           return (
//             <Route
//               key={i}
//               path={route.path}
//               element={
//                 route.isPrivate ? (
//                   <PrivateRoute menuItem={route.menuItem}>
//                     <Layout>{element}</Layout>
//                   </PrivateRoute>
//                 ) : (
//                   <PublicRoute>{element}</PublicRoute>
//                 )
//               }
//             />
//           );
//         }
//       )}

//       {/* Catch-all route for 404 */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }
