// ============================================
// Product Types
// ============================================
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  inStock: boolean;
  quantity?: number | string; // Puede ser número o string (ej: "1kg", "500g")
  rating?: number; // Calificación del producto (0-5)
  createdAt?: Date;
  updatedAt?: Date;
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
