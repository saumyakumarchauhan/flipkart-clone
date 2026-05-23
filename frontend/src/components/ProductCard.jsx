import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext'; // 1. Import Context

const ProductCard = ({ product }) => {
  // 2. Extract context functions
  const { toggleWishlist, isInWishlist } = useWishlist(); 
  
  // 3. Define isFav for this specific card
  const isFav = isInWishlist(product.id); 

  return (
    <Link to={`/product/${product.id}`} className="bg-white border border-gray-200 rounded-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer group flex flex-col h-full relative">
      
      {/* Product Image Box */}
      <div className="p-4 relative flex items-center justify-center h-48 bg-gray-50">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}
      </div>

      {/* Wishlist Heart - Now using a button and preventing Link navigation when clicked */}
      <button 
        onClick={(e) => {
          e.preventDefault(); // Prevents the card from redirecting when clicking the heart
          toggleWishlist(product);
        }} 
        className={`absolute top-3 right-3 z-10 transition-colors ${
          isFav ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
        </svg>
      </button>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-gray-500 text-sm font-medium">{product.brand}</p>
        <h3 className="text-sm text-gray-800 line-clamp-1 mt-1 group-hover:text-blue-600">
          {product.name}
        </h3>
        
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
          <span className="text-sm font-medium text-green-600">{product.discount}% off</span>
        </div>
        
        <div className="mt-1 text-xs text-gray-600 font-medium">Free delivery</div>
      </div>
    </Link>
  );
};

export default ProductCard;