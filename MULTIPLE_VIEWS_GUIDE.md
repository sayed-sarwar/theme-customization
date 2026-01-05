# Dynamic Page Multiple Views System

This guide explains how to use and configure the multiple views system in your dynamic pages.

## Overview

The multiple views system allows you to create different views for the same data model (e.g., list, create, edit, view, analytics) and seamlessly switch between them. Each view can have its own configuration, permissions, and UI components.

## How It Works

### 1. URL Structure
```
/{model}/{view}/{id?}
```

Examples:
- `/sales_order/list` - List all sales orders
- `/sales_order/create` - Create new sales order
- `/sales_order/view/123` - View sales order #123
- `/sales_order/edit/123` - Edit sales order #123
- `/product/analytics/456` - View analytics for product #456

### 2. Configuration Structure

Each model is configured in a JSON file with multiple views:

```json
{
  "model": "product",
  "label": "Product Management",
  "views": {
    "list": {
      "component": "ListView",
      "title": "Product Catalog",
      "permissions": ["product.read"],
      "columns": [...],
      "actions": ["create", "view", "edit"]
    },
    "create": {
      "component": "FormView",
      "title": "Add New Product",
      "permissions": ["product.create"],
      "fields": [...]
    },
    "view": {
      "component": "DetailView",
      "title": "Product Details",
      "permissions": ["product.read"]
    },
    "edit": {
      "component": "FormView",
      "title": "Edit Product",
      "permissions": ["product.update"],
      "fields": [...]
    }
  },
  "defaultView": "list"
}
```

### 3. Available Components

#### ListView
- Displays data in a table format
- Supports columns configuration
- Includes action buttons (create, view, edit, delete)
- Handles pagination and filtering

#### FormView
- Handles both create and edit operations
- Supports various field types (text, select, textarea, number, date)
- Includes validation and form submission
- Provides navigation between views

#### DetailView
- Shows detailed information about a single item
- Supports sections and custom layouts
- Includes action buttons for editing and navigation

## Configuration Options

### ListView Configuration
```json
{
  "component": "ListView",
  "title": "Custom List Title",
  "columns": [
    { "key": "id", "label": "ID" },
    { "key": "name", "label": "Name" },
    { "key": "status", "label": "Status" }
  ],
  "actions": ["create", "view", "edit", "delete"],
  "filters": [
    { "key": "status", "type": "select", "options": ["Active", "Inactive"] }
  ]
}
```

### FormView Configuration
```json
{
  "component": "FormView",
  "title": "Form Title",
  "fields": [
    {
      "name": "product_name",
      "label": "Product Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter product name"
    },
    {
      "name": "category",
      "label": "Category",
      "type": "select",
      "options": ["Electronics", "Clothing", "Books"],
      "required": true
    },
    {
      "name": "description",
      "label": "Description",
      "type": "textarea"
    },
    {
      "name": "price",
      "label": "Price",
      "type": "number",
      "min": 0,
      "step": 0.01
    }
  ]
}
```

### DetailView Configuration
```json
{
  "component": "DetailView",
  "title": "Detail Title",
  "sections": [
    {
      "title": "Basic Information",
      "fields": ["name", "description", "category"]
    },
    {
      "title": "Pricing",
      "fields": ["price", "cost", "margin"]
    }
  ]
}
```

## Field Types

### Text Input
```json
{ "name": "title", "type": "text", "required": true }
```

### Number Input
```json
{ "name": "price", "type": "number", "min": 0, "step": 0.01 }
```

### Select Dropdown
```json
{ 
  "name": "category", 
  "type": "select", 
  "options": ["Option1", "Option2"],
  "default": "Option1"
}
```

### Textarea
```json
{ "name": "description", "type": "textarea", "rows": 4 }
```

### Date Input
```json
{ "name": "created_date", "type": "date" }
```

## Navigation Between Views

The system automatically provides navigation between views:

1. **View Tabs**: Displayed at the top when multiple views are available
2. **Action Buttons**: Context-aware buttons in each view
3. **URL Updates**: Seamless URL updates without page reloads

### Programmatic Navigation
```typescript
// In your component
const handleViewChange = (newView: string) => {
  onViewChange(newView); // Provided by the system
};
```

## Adding New Views

1. **Create the view configuration** in your model's JSON file
2. **Choose the appropriate component** (ListView, FormView, DetailView)
3. **Configure fields, permissions, and actions**
4. **The view will automatically appear** in the navigation

### Custom Views
To create custom view components:

1. Create your component in `src/pages/dynamicpage/views/`
2. Add it to the `COMPONENT_MAP` in `PageRenderer.tsx`
3. Use it in your configuration

```typescript
// CustomAnalyticsView.tsx
interface CustomAnalyticsViewProps {
  config: any;
  model: string;
  view: string;
  id?: string;
  onViewChange: (view: string) => void;
  availableViews: string[];
}

const CustomAnalyticsView = ({ config, model, id }: CustomAnalyticsViewProps) => {
  return (
    <div>
      <h2>Analytics for {model} #{id}</h2>
      {/* Your custom analytics UI */}
    </div>
  );
};
```

## Permissions

Each view can have its own permissions:

```json
{
  "view": {
    "component": "DetailView",
    "permissions": ["product.read", "analytics.view"]
  }
}
```

## Best Practices

1. **Keep configurations simple** - Start with basic views and add complexity as needed
2. **Use consistent naming** - Follow the pattern: list, create, view, edit
3. **Configure permissions** - Always specify appropriate permissions for each view
4. **Provide clear titles** - Use descriptive titles for better UX
5. **Test navigation** - Ensure smooth transitions between views

## Examples

Check out these example configurations:
- `src/config/sales_order.json` - Basic CRUD views
- `src/config/purchase_order.json` - Purchase order management
- `src/config/example_multi_view.json` - Complete example with all features

## Demo

Visit `/demo/multi-view` to see the system in action and test different configurations.

## Troubleshooting

### View Not Found
- Check that the view exists in your model's configuration
- Verify the view name matches exactly (case-sensitive)

### Component Not Registered
- Ensure the component is imported in `PageRenderer.tsx`
- Add it to the `COMPONENT_MAP`

### Navigation Issues
- Check that `availableViews` includes the target view
- Verify permissions for the target view

### Configuration Errors
- Validate your JSON configuration
- Check that all required fields are present
- Ensure field types are supported