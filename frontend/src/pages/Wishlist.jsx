import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-10 mt-4 flex justify-center">
        <div className="bg-white w-full max-w-4xl p-12 flex flex-col items-center shadow-sm border border-gray-200 rounded-sm">
          <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Empty Wishlist</h2>
          <p className="text-sm text-gray-500 mb-6">You have no items saved in your wishlist. Start adding some now!</p>
          <Link to="/" className="bg-[#2874f0] text-white px-12 py-3 shadow-sm rounded-sm font-medium hover:bg-blue-600 transition-colors">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 pb-12 mt-4">
      <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm">
        
        {/* Header Title Section */}
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            My Wishlist 
            <span className="text-sm font-normal text-gray-500">({wishlistItems.length} items)</span>
          </h1>
        </div>

        {/* Reusing unified Product Grid Card components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="border border-gray-100 rounded-sm hover:shadow-md transition-shadow bg-white">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Wishlist;