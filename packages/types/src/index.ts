// ============================================
// Product Types
// ============================================
export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string | null;
  stock: number;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductStats {
  total: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}

export interface ProductFilters {
  skip?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// ============================================
// Order Types
// ============================================
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// User Types
// ============================================
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'operator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Category Types
// ============================================
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
