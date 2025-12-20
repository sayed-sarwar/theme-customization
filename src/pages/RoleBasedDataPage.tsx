import { useAuth } from '@/context/AuthContext';
import { useRoleBasedMenu } from '@/hooks/useRoleBasedMenu';

const RoleBasedDataPage = () => {
  const { user } = useAuth();
  const { menuItems } = useRoleBasedMenu();

  const getRoleSpecificData = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Administrator Dashboard',
          data: [
            { module: 'User Management', access: 'Full Access' },
            { module: 'Financial Reports', access: 'Full Access' },
            { module: 'System Settings', access: 'Full Access' },
            { module: 'Audit Logs', access: 'Full Access' }
          ]
        };
      case 'accountant':
        return {
          title: 'Accountant Dashboard',
          data: [
            { module: 'Chart of Accounts', access: 'Read/Write' },
            { module: 'Journal Entries', access: 'Read/Write' },
            { module: 'Financial Reports', access: 'Read Only' },
            { module: 'Tax Management', access: 'Read/Write' }
          ]
        };
      case 'sales':
        return {
          title: 'Sales Dashboard',
          data: [
            { module: 'Sales Orders', access: 'Read/Write' },
            { module: 'Customer Management', access: 'Read/Write' },
            { module: 'Sales Reports', access: 'Read Only' },
            { module: 'Inventory View', access: 'Read Only' }
          ]
        };
      case 'purchase':
        return {
          title: 'Purchase Dashboard',
          data: [
            { module: 'Purchase Orders', access: 'Read/Write' },
            { module: 'Vendor Management', access: 'Read/Write' },
            { module: 'Purchase Reports', access: 'Read Only' },
            { module: 'Inventory Management', access: 'Read/Write' }
          ]
        };
      default:
        return {
          title: 'Dashboard',
          data: []
        };
    }
  };

  const roleData = getRoleSpecificData();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{roleData.title}</h1>
        <p className="text-gray-600">Welcome, {user?.name || user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Modules */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Available Modules</h2>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-green-600">Accessible</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Permissions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Role Permissions</h2>
          <div className="space-y-2">
            {roleData.data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{item.module}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  item.access === 'Full Access' ? 'bg-green-100 text-green-800' :
                  item.access === 'Read/Write' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.access}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{menuItems.length}</div>
            <div className="text-sm text-gray-600">Accessible Modules</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{roleData.data.length}</div>
            <div className="text-sm text-gray-600">Permissions</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{user?.role?.toUpperCase()}</div>
            <div className="text-sm text-gray-600">Current Role</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">Active</div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedDataPage;