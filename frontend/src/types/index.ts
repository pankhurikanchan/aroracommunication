export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string | null;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  displayOrder: number;
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  isFeatured: boolean;
  _count?: { products: number };
}

export interface ProductVariant {
  id: string;
  productId: string;
  color?: string | null;
  colorCode?: string | null;
  ram?: string | null;
  storage?: string | null;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  sku: string;
  imageUrl?: string | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  discountPercentage?: number | null;
  stockQuantity: number;
  sku: string;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isDealsOffer: boolean;
  isPremium: boolean;
  warrantyInfo?: string | null;
  boxContents?: string | null;
  deliveryInfo?: string | null;
  returnPolicy?: string | null;
  specifications?: string | null;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  product: Product;
  variant?: ProductVariant | null;
}

export interface CartData {
  id: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

export interface Address {
  id: string;
  userId?: string | null;
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'UPI'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'CASH_ON_DELIVERY';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  productImage?: string | null;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  addressId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  couponCode?: string | null;
  trackingNumber?: string | null;
  notes?: string | null;
  createdAt: string;
  address: Address;
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  value: number;
  minSpend: number;
  maxDiscount?: number | null;
  endDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  bgGradient?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  inStock: boolean;
  ram: string;
  storage: string;
  sort: string;
}
