# Role-Based Routing System

This ERP application implements a comprehensive role-based routing system using React Router DOM and the data1.json configuration file.

## Features

### 1. Dynamic Route Generation
- Routes are automatically generated based on `data1.json`
- Each menu item includes role permissions
- Nested routes supported for hierarchical menus

### 2. Role-Based Access Control
- Four user roles: `admin`, `accountant`, `sales`, `purchase`
- Menu items filtered based on user role
- Unauthorized access redirects to `/unauthorized`

### 3. Page-wise Data Display
- Different content shown based on user role
- Role-specific dashboards and permissions
- Dynamic module access based on role

## File Structure

```
src/
├── routes/
│   ├── Route.tsx              # Main routing component
│   ├── ProtectedRoute.tsx     # Authentication guard
│   └── RoleBasedPages.tsx     # Dynamic role-based routing
├── components/
│   ├── PageRenderer.tsx       # Dynamic page loading
│   ├── RoleBasedNavigation.tsx # Role-filtered navigation
│   └── RoleSwitcher.tsx       # Demo role switching
├── hooks/
│   └── useRoleBasedMenu.ts    # Menu filtering hook
├── pages/
│   └── RoleBasedDataPage.tsx  # Role-specific content
└── staticjson/
    └── data1.json             # Menu configuration
```

## Demo Users

For testing purposes, use these credentials:

| Email | Password | Role |
|-------|----------|------|
| admin@erp.com | admin123 | admin |
| accountant@erp.com | admin123 | accountant |
| sales@erp.com | admin123 | sales |
| purchase@erp.com | admin123 | purchase |

## Role Permissions

### Admin
- Full access to all modules
- User management
- System settings
- Audit & compliance

### Accountant
- Chart of accounts
- Journal entries
- Tax management
- Financial reports (read-only)

### Sales
- Sales orders
- Customer management
- Sales reports (read-only)
- Inventory view (read-only)

### Purchase
- Purchase orders
- Vendor management
- Purchase reports (read-only)
- Inventory management

## Usage

1. **Login**: Use demo credentials to login with different roles
2. **Navigation**: Sidebar shows only accessible modules for current role
3. **Role Switching**: Use the role switcher in topbar for testing
4. **Page Content**: Each page shows role-specific data and permissions

## Configuration

The `data1.json` file defines:
- Menu structure
- Route paths
- Role permissions
- Icons and labels
- Nested menu items

Example menu item:
```json
{
  "key": "sales",
  "label": "Sales",
  "icon": "shopping-cart",
  "route": "/sales",
  "roles": ["admin", "sales"]
}
```

## Key Components

### useRoleBasedMenu Hook
Filters menu items based on current user role:
```tsx
const { menuItems, userRole } = useRoleBasedMenu();
```

### ProtectedRoute Component
Guards routes requiring authentication:
```tsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

### PageRenderer Component
Dynamically loads pages based on route key:
```tsx
<PageRenderer pageKey="sales" pageType="Dashboard" />
```

## Security Notes

- Routes are protected at component level
- Backend should also validate permissions
- Role switching is for demo only
- In production, roles should be managed server-side