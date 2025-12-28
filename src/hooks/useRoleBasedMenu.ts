import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import menuData from '@/staticjson/data1.json';

export const useRoleBasedMenu = () => {
  const { user } = useAuth();

  const filteredMenu = useMemo(() => {
    if (!user) return [];
    // Return all menu items without role filtering
    return menuData;
  }, [user]);

  return { menuItems: filteredMenu, userRole: user?.role };
};