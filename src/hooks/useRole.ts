import { useAuth } from "@/context/AuthContext";
import { hasAccess } from "@/utils/roleUtils";

export const useRole = () => {
  const { user } = useAuth();
  
  const checkRole = (roles: string[] | string): boolean => {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return hasAccess(roleArray, user?.role || null);
  };

  const isAdmin = () => checkRole(['admin']);
  const isAccountant = () => checkRole(['accountant']);
  const isSales = () => checkRole(['sales']);
  const isPurchase = () => checkRole(['purchase']);

  return {
    userRole: user?.role || null,
    checkRole,
    isAdmin,
    isAccountant,
    isSales,
    isPurchase,
  };
};