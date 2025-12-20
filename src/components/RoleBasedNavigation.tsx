import { Link, useLocation } from 'react-router-dom';
import { useRoleBasedMenu } from '@/hooks/useRoleBasedMenu';

const RoleBasedNavigation = () => {
  const { menuItems, userRole } = useRoleBasedMenu();
  const location = useLocation();

  const renderMenuItem = (item: any, level = 0) => {
    const isActive = location.pathname === item.route;
    
    return (
      <div key={item.key} className={`menu-item level-${level}`}>
        {item.route ? (
          <Link 
            to={item.route} 
            className={`nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        ) : (
          <div className="nav-header">
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </div>
        )}
        
        {item.children && (
          <div className="submenu">
            {item.children.map((child: any) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="role-based-navigation">
      <div className="user-info">
        <span>Role: {userRole}</span>
      </div>
      <div className="menu-items">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;