import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import menuData from '@/staticjson/data1.json';

export const useRoleBasedMenu = () => {
  const { user } = useAuth();

  const filteredMenu = useMemo(() => {
    if (!user) return [];

    const filterMenuItems = (items: any[]): any[] => {
      return items
        .filter(item => item.roles.includes(user.role))
        .map(item => ({
          ...item,
          children: item.children ? filterMenuItems(item.children) : undefined
        }))
        .filter(item => !item.children || item.children.length > 0);
    };

    return filterMenuItems(menuData);
  }, [user]);

  return { menuItems: filteredMenu, userRole: user?.role };
};