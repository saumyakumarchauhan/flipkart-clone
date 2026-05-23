import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // 1. Import Auth

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth(); // 2. Get real user

  // 3. Fetch only if user is logged in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const addToCart = async (product) => {
    if (!user) return; // Guard clause
    try {
      await fetch('http://127.0.0.1:8000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: product.id, quantity: 1 })
      });
      fetchCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setCartItems((prev) => prev.filter(item => item.id !== cartItemId));
    try {
      await fetch(`http://127.0.0.1:8000/api/cart/remove/${cartItemId}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      fetchCart();
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    setCartItems((prev) => 
      prev.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity } : item)
    );
    try {
      await fetch(`http://127.0.0.1:8000/api/cart/update/${cartItemId}?quantity=${newQuantity}`, { method: 'PUT' });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};