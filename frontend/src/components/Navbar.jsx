import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { user, logout } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white shadow-md z-50 sticky top-0">
      {/* Main Blue Bar */}
      <div className="bg-[#2874f0] py-2.5 px-4 sm:px-10 flex items-center justify-center h-14">
        <div className="w-full max-w-7xl flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <Link to="/" className="flex flex-col items-end min-w-[80px]">
            <span className="text-white font-bold italic text-xl tracking-tight leading-tight">
              Flipkart
            </span>
            <span className="text-white text-[11px] italic flex items-center gap-1 hover:underline">
              Explore <span className="text-[#ffe500] font-bold">Plus</span>
              <svg width="10" height="10" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path className="_1_3w1N" d="M14.32 8l-1.3-1.6.2-2.1-2-.5-.9-1.9-2.1.8-2.1-.8-.9 1.9-2 .5.2 2.1-1.3 1.6 1.3 1.6-.2 2.1 2 .5.9 1.9 2.1-.8 2.1.8.9-1.9 2-.5-.2-2.1 1.3-1.6z" fill="#ffe500"></path></svg>
            </span>
          </Link>

          {/* Search Bar - White background UI */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl bg-white flex items-center rounded-sm shadow-sm overflow-hidden hidden sm:flex">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products, brands and more" 
              className="w-full py-2 px-4 text-sm outline-none text-black"
            />
            <button type="submit" className="px-3 text-[#2874f0]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6 text-white font-medium text-base">
            
            {/* Account Dropdown */}
            {user ? (
              <div className="relative group cursor-pointer py-4">
                <div className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span>{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                  <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                <div className="absolute top-[50px] -left-12 w-64 bg-white text-gray-800 shadow-xl border border-gray-100 rounded-b-sm hidden group-hover:flex flex-col z-50">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
                  <div className="flex flex-col relative z-10 bg-white">
                    <Link to="/profile" className="px-5 py-3.5 hover:bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-sm font-medium">My Profile</Link>
                    <Link to="/wishlist" className="px-5 py-3.5 hover:bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-sm font-medium">My Wishlist</Link>
                    <Link to="/orders" className="px-5 py-3.5 hover:bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-sm font-medium">My Orders</Link>
                    <button onClick={logout} className="px-5 py-3.5 hover:bg-gray-50 flex items-center gap-4 text-sm font-medium text-left w-full text-red-500">Log Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-[#2874f0] px-8 py-1.5 font-semibold rounded-sm hover:bg-gray-100 transition-colors">
                Login
              </Link>
            )}

            {/* "More" Dropdown */}
            <div className="hidden md:flex cursor-pointer font-semibold relative group items-center gap-1 hover:text-gray-200 py-4">
               More
               <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            
            <Link to="/cart" className="flex items-center gap-2 cursor-pointer font-semibold relative">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
                <span>Cart</span>
                {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#2874f0]">
                {totalItems}
                </span>
                )}
            </Link>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-white border-b shadow-sm hidden lg:flex justify-center py-3 px-10">
        <div className="w-full max-w-7xl flex justify-between text-[14px] text-gray-700 font-semibold">
          <Link to="/products?category=Electronics" className="hover:text-[#2874f0]">Electronics</Link>
          <Link to="/products?category=TVs %26 Appliances" className="hover:text-[#2874f0]">TVs & Appliances</Link>
          <Link to="/products?category=Men" className="hover:text-[#2874f0]">Men</Link>
          <Link to="/products?category=Women" className="hover:text-[#2874f0]">Women</Link>
          <Link to="/products?category=Baby %26 Kids" className="hover:text-[#2874f0]">Baby & Kids</Link>
          <Link to="/products?category=Home %26 Furniture" className="hover:text-[#2874f0]">Home & Furniture</Link>
          <Link to="/products?category=Sports" className="hover:text-[#2874f0]">Sports, Books & More</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;