import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { CartData, CartItem } from '../types';

interface CouponInfo {
  code: string;
  discount: number;
  discountType: string;
  value: number;
}

interface CartContextType {
  cart: CartData;
  loading: boolean;
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  finalTotal: number;
  coupon: CouponInfo | null;
  addToCart: (productId: string, variantId?: string | null, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  refreshCart: () => Promise<void>;
}

const defaultCart: CartData = {
  id: null,
  items: [],
  subtotal: 0,
  deliveryCharge: 0,
  total: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartData>(defaultCart);
  const [loading, setLoading] = useState<boolean>(true);
  const [coupon, setCoupon] = useState<CouponInfo | null>(() => {
    const saved = localStorage.getItem('arora_applied_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, variantId?: string | null, quantity = 1): Promise<boolean> => {
    try {
      const res = await api.post('/cart', {
        productId,
        variantId,
        quantity,
      });
      if (res.data.success) {
        setCart(res.data.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add to cart', err);
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      if (res.data.success) {
        setCart(res.data.data);
        removeCoupon();
      }
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/coupons/validate', {
        code,
        amount: cart.subtotal,
      });

      if (res.data.success) {
        const info: CouponInfo = {
          code: res.data.data.code,
          discount: res.data.data.discount,
          discountType: res.data.data.discountType,
          value: res.data.data.value,
        };
        setCoupon(info);
        localStorage.setItem('arora_applied_coupon', JSON.stringify(info));
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Invalid coupon' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error validating coupon code',
      };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    localStorage.removeItem('arora_applied_coupon');
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.subtotal;
  const discount = coupon ? coupon.discount : 0;
  const deliveryCharge = subtotal > 1000 || subtotal === 0 ? 0 : 49;
  const finalTotal = Math.max(0, subtotal - discount + deliveryCharge);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        subtotal,
        discount,
        deliveryCharge,
        finalTotal,
        coupon,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
