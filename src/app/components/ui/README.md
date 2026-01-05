# Generic UI Components for Activity Report

This directory contains reusable generic components designed to reduce code duplication and standardize the UI across all Activity Report modules.

## Components Overview

### 1. `GenericListPage`

A reusable page component for displaying and managing data in a table format.

**Usage Example:**
```tsx
import GenericListPage, { ColumnConfig, FilterConfig } from "@/app/components/ui/GenericListPage";
import YourModal from "./YourModal";

export default function YourPage() {
  // Define columns for the data table
  const columns: ColumnConfig[] = [
    {
      key: "title",
      header: "Title",
      render: (item) => <div className="text-sm font-medium">{item.title}</div>,
    },
    // Add more columns...
  ];

  // Define filters
  const filters: FilterConfig[] = [
    {
      key: "title",
      label: "Title",
      type: "text",
    },
    // Add more filters...
  ];

  return (
    <GenericListPage<YourDataType>
      title="Your Title"
      apiEndpoint="/api/your-endpoint"
      breadcrumbsItems={[
        { label: "Home", href: "/" },
        { label: "Your Page" },
      ]}
      columns={columns}
      filters={filters}
      modal={YourModal}
    />
  );
}
```

### 2. `GenericModal`

A reusable modal component for creating and editing data.

**Usage Example:**
```tsx
import GenericModal, { FieldConfig } from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";

interface YourModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: YourDataType | null;
}

export default function YourModal({ isOpen, onClose, item }: YourModalProps) {
  // Define fields for the form
  const fields: FieldConfig[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    // Add more fields...
  ];

  return (
    <GenericModal<YourDataType>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Your Item"
      apiEndpoint="/api/your-endpoint"
      fields={fields}
    />
  );
}
```

### 3. `ArrayField`

A reusable component for managing arrays of objects (e.g., authors, coordinators).

**Usage Example:**
```tsx
<ArrayField<YourItemType>
  items={items}
  onAdd={onAdd}
  onRemove={onRemove}
  itemLabel="Item Label"
  fields={[
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    // Add more fields...
  ]}
/>
```

## How to Create a New Module

1. **Define your data interfaces:**
```tsx
interface YourDataType {
  _id?: string;
  title: string;
  // Add more fields...
}
```

2. **Create a Modal component:**
```tsx
// Create YourModal.tsx
import GenericModal, { FieldConfig } from "@/app/components/ui/GenericModal";

export default function YourModal({ isOpen, onClose, item }) {
  // Define fields
  const fields: FieldConfig[] = [...];
  
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Your Item"
      apiEndpoint="/api/your-endpoint"
      fields={fields}
    />
  );
}
```

3. **Create a Page component:**
```tsx
// Create page.tsx
import GenericListPage, { ColumnConfig, FilterConfig } from "@/app/components/ui/GenericListPage";
import YourModal from "./YourModal";

export default function YourPage() {
  // Define columns
  const columns: ColumnConfig[] = [...];
  
  // Define filters
  const filters: FilterConfig[] = [...];
  
  return (
    <GenericListPage
      title="Your Title"
      apiEndpoint="/api/your-endpoint"
      breadcrumbsItems={[...]}
      columns={columns}
      filters={filters}
      modal={YourModal}
    />
  );
}
```

## Customization

Each component is designed to be customizable:

- **GenericListPage**: Customize columns, filters, and add extra action buttons
- **GenericModal**: Add custom field types and validation
- **ArrayField**: Define different fields for array items

## Benefits

- **Reduced Code Duplication**: Reuse the same components across modules
- **Standardized UI**: Consistent user experience across the application
- **Type Safety**: Fully typed components for better development experience
- **Maintainability**: Changes to one component propagate to all modules

## Examples

See example implementations in:
- `/activity-report/sponsored-projects/page-generic.tsx`
- `/activity-report/books/page-generic.tsx` 