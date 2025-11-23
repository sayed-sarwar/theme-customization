import { componentMap } from "./componentsMap";

export function generateRoutes(config: any, routes: any = [], parentPath: string = "") {
  if (!routes) {
    routes = [];
  }

  const joinPaths = (base: string, path: string): string => {
    const b = base || "";
    const pRaw = path || "";
    if (!b && !pRaw) return "/";
    if (pRaw.startsWith("/")) return pRaw;
    const p = pRaw.replace(/^\/+/, "");
    if (!b) return `/${p}`;
    const cleanedBase = b.endsWith("/") ? b.slice(0, -1) : b;
    const joined = `${cleanedBase}/${p}`;
    return joined.startsWith("/") ? joined : `/${joined}`;
  };

  if (config && config.navigation && Array.isArray(config.navigation)) {
    config.navigation.forEach((navItem: any) => {
      generateRoutes(navItem, routes, parentPath);
    });
  }

  if (config && config.url) {
    const fullPath = joinPaths(parentPath, config.url);
    
    let component: any | undefined = undefined;
    if (config.type && componentMap[config.type]) {
      component = componentMap[config.type];
    } else {
      component = componentMap.Page;
    }

    routes.push({
      path: fullPath,
      component,
      menuItem: config,
      isPrivate: config.isPrivate !== false,
    });

    parentPath = fullPath;
  }

  if (config && config.children && Array.isArray(config.children)) {
    config.children.forEach((child: any) => generateRoutes(child, routes, parentPath));
  }

  if (config && config.submenu && Array.isArray(config.submenu)) {
    config.submenu.forEach((child: any) => generateRoutes(child, routes, parentPath));
  }

  if (config && config.item && Array.isArray(config.item)) {
    config.item.forEach((child: any) => generateRoutes(child, routes, parentPath));
  }

  if (config && config.subItems?.TabMenu && Array.isArray(config.subItems.TabMenu)) {
    config.subItems.TabMenu.forEach((child: any) =>
      generateRoutes(child, routes, parentPath)
    );
  }

  if (config && config.page && Array.isArray(config.page)) {
    config.page.forEach((child: any) =>
      generateRoutes(child, routes, parentPath)
    );
  }

  return routes;
}