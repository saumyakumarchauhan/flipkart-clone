import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext'; 
import { CartProvider } from './context/CartContext'; 
import { WishlistProvider } from './context/WishlistContext';

// Components & Pages
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart'; 
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';

function App() {
  return (
    // 1. AuthProvider goes FIRST so the other providers know who is logged in!
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Navbar />
            <div className="bg-gray-100 min-h-[calc(100vh-100px)] pt-4 pb-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/products" element={<ProductList />} />
              </Routes>
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;