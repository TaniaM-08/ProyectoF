"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: CartProduct[];
  cartCount: number;
  addToCart: (product: CartProduct, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Sincroniza el carrito con localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartProduct, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity <= 0) {
          // Eliminar producto si la cantidad es 0 o menos
          return prev.filter(p => p.id !== product.id);
        }
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: newQuantity } : p
        );
      }
      // Solo agregar si la cantidad es positiva
      return quantity > 0 ? [...prev, { ...product, quantity }] : prev;
    });
  };

  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
