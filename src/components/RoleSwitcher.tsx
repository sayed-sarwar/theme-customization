import { useAuth } from '@/context/AuthContext';

const RoleSwitcher = () => {
  const { user } = useAuth();
  
  const roles = ['admin', 'accountant', 'sales', 'purchase'];

  const handleRoleChange = (newRole: string) => {
    // This is for demo purposes - in real app, role changes would be handled by backend
    if (user) {
      const updatedUser = { ...user, role: newRole };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      window.location.reload(); // Simple reload to update the UI
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Switch Role:</span>
      <select 
        value={user?.role || ''} 
        onChange={(e) => handleRoleChange(e.target.value)}
        className="text-sm border border-gray-300 rounded px-2 py-1"
      >
        {roles.map(role => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSwitcher;