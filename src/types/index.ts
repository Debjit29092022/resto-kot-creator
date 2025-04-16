
// Common types for the application

export interface MenuItem {
  id?: number;
  category: string;
  name: string;
  price?: number;
  prices?: Record<string, number>;
  description?: string;
  isVeg: boolean;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  size?: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id?: number;
  orderNumber?: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  waiterName?: string;
}

export interface Profile {
  id: string;
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  gst?: string;
  logo?: string;
  tagline?: string;
}

export interface Settings {
  id: string;
  taxRate: number;
  printerName?: string;
  receiptHeader?: string;
  receiptFooter?: string;
}
