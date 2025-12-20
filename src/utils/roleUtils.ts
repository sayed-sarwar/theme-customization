import type { RouteConfig } from "@/routes/types";

export const filterRoutesByRole = (routes: RouteConfig[], userRole: string | null): RouteConfig[] => {
  if (!userRole) return [];
  
  return routes.filter(route => {
    if (!route.roles || route.roles.length === 0) return true;
    return route.roles.includes(userRole);
  });
};

export const hasAccess = (roles: string[] | undefined, userRole: string | null): boolean => {
  if (!roles || roles.length === 0) return true;
  if (!userRole) return false;
  return roles.includes(userRole);
};