// src/data/sidebarMenu.ts
import { 
  Home, 
  ShoppingCart, 
  CreditCard, 
  PiggyBank, 
  BarChart3, 
  FileText, 
  ShieldCheck, 
  FileCheck, 
  Receipt, 
  Calculator,
  MoreHorizontal 
} from 'lucide-react'; // or any icon library like @mui/icons-material

export const sidebarMenu = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/sales', label: 'Sales', icon: ShoppingCart },
  { path: '/purchase', label: 'Purchase', icon: ShoppingCart },
  { path: '/card-bank', label: 'Card & Bank', icon: CreditCard },
  {
    label: 'Account',
    icon: PiggyBank,
    subItems: [
      { path: '/chart-account', label: 'Chart of Account', icon: BarChart3 },
      { path: '/journal-entry', label: 'Journal Entry', icon: FileText },
      { path: '/audit-compliance', label: 'Audit & Compliance', icon: ShieldCheck },
      { path: '/vendor-invoice', label: 'Vendor Invoice', icon: FileCheck },
    ]
  },
  { path: '/taxes', label: 'Taxes', icon: Receipt },
  { path: '/expenses', label: 'Expenses', icon: Calculator },
  { path: '/more', label: 'More', icon: MoreHorizontal },
];