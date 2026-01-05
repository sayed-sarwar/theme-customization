# Using newSalesPageConfig.json with Dynamic Pages

This guide explains how to use your existing `newSalesPageConfig.json` structure with the dynamic page system.

## Configuration Structure

Your `newSalesPageConfig.json` has a rich structure that includes:

- **pageConfig**: Basic page settings (title, currency, etc.)
- **formFields**: Main form fields (customer, amount, date, status, description)
- **tabs**: Tab-based interface (Item Details, Payment Details, Terms & Conditions, Attachments)
- **itemTableConfig**: Editable table for line items
- **paymentDetails**: Payment method and terms configuration
- **termsConditions**: Default and custom terms
- **attachments**: File upload configuration
- **actions**: Form action buttons (Save, Cancel, Make Recurring, etc.)
- **validation**: Form validation rules
- **notifications**: Success/error messages

## How It Works

The system automatically detects the `newSalesPageConfig.json` structure and:

1. **Recognizes the format**: When `pageConfig` property is found (instead of `views`), it treats it as a single-view configuration
2. **Maps to SalesFormView**: Automatically uses the `SalesFormView` component
3. **Passes full config**: The entire configuration is passed to the component
4. **Single view mode**: No view tabs are shown since it's a single-purpose form

## URL Access

To access your new sales form:

```
/new_sales/create
```

The system will:
- Load `newSalesPageConfig.json` 
- Render using `SalesFormView` component
- Display the full tabbed interface with all features

## Features Included

### ✅ Main Form Fields
- Customer (text input with validation)
- Amount (number input with min/max validation)
- Date (date picker with "today" default)
- Status (dropdown with Pending/Paid/Overdue options)
- Description (textarea with character limit)

### ✅ Tabbed Interface
- **Item Details**: Editable table for line items
- **Payment Details**: Payment method and terms
- **Terms & Conditions**: Default terms + custom terms editor
- **Attachments**: File upload with type/size restrictions

### ✅ Item Table Features
- Add/remove rows
- Editable cells (category, item, quantity, rate, tax)
- Automatic amount calculation
- Column width configuration
- Validation for required fields

### ✅ Action Buttons
- Cancel (with dropdown options)
- Make Recurring
- Save
- Save and Send (with dropdown options)

### ✅ Validation
- Required field validation
- Min/max value validation
- Character limits
- Minimum items requirement

## Testing

1. **Visit the demo**: Go to `/demo/multi-view`
2. **Select "New Sales Form"** from the dropdown
3. **Click "create"** to open the advanced form
4. **Test all features**:
   - Fill out main form fields
   - Switch between tabs
   - Add/edit items in the table
   - Try different payment options
   - Upload attachments (UI only)

## Customization

To modify the form:

1. **Edit `src/config/newSalesPageConfig.json`**
2. **Add/remove form fields** in the `formFields` section
3. **Modify tabs** in the `tabs` array
4. **Update item table columns** in `itemTableConfig.columns`
5. **Change validation rules** in the `validation` section

## Integration with Existing Code

The `SalesFormView` component is designed to work with your existing:
- Form validation logic
- API endpoints
- State management
- Business rules

Simply connect the form submission to your existing backend APIs and the form will integrate seamlessly with your current system.

## Example Usage

```typescript
// The system automatically handles this mapping:
// /new_sales/create -> newSalesPageConfig.json -> SalesFormView component

// Your existing API calls can be integrated in the SalesFormView component:
const handleSave = async () => {
  const response = await fetch('/api/sales', {
    method: 'POST',
    body: JSON.stringify({ formData, items }),
    headers: { 'Content-Type': 'application/json' }
  });
  // Handle response...
};
```

## Benefits

- **No code changes needed**: Your existing JSON configuration works as-is
- **Rich UI**: Professional tabbed interface with advanced features
- **Validation**: Built-in form validation based on your config
- **Responsive**: Works on desktop and mobile devices
- **Extensible**: Easy to add new fields, tabs, or features
- **Consistent**: Follows the same patterns as other dynamic pages