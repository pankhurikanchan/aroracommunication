import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface WishlistContextType {
  wishlistIds: Set<string>;
  wishlistProducts: Product[];
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlistIds(new Set());
      setWishlistProducts([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.data.success && res.data.data) {
        const items = res.data.data.items || [];
        const ids = new Set<string>(items.map((i: any) => i.productId));
        const products = items.map((i: any) => i.product);
        setWishlistIds(ids);
        setWishlistProducts(products);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const res = await api.post('/wishlist/toggle', { productId });
      if (res.data.success) {
        const isAdded = res.data.inWishlist;
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (isAdded) next.add(productId);
          else next.delete(productId);
          return next;
        });
        refreshWishlist();
        return isAdded;
      }
      return false;
    } catch (err) {
      console.error('Error toggling wishlist', err);
      return false;
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        loading,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
