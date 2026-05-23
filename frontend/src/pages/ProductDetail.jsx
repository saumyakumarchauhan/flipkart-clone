import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext'; // <-- NEW: Import Auth Context

const ProductDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { addToCart } = useCart(); 
  const { toggleWishlist, isInWishlist } = useWishlist(); 
  
  // NEW: Auth state to block guests
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        
        const data = await response.json();
        setProduct(data);
        
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="text-center mt-20 text-red-500 text-xl">{error || "Product not found"}</div>;
  }

  // --- NEW GUARDRAILS ---
  const handleAddToCart = () => {
    if (!user) {
      alert("Please login first to add items to your cart!");
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please login first to purchase items!");
      navigate('/login');
      return;
    }
    addToCart(product); 
    navigate('/checkout');  
  };

  const handleWishlistToggle = () => {
    if (!user) {
      alert("Please login first to wishlist items!");
      navigate('/login');
      return;
    }
    toggleWishlist(product);
  };

  const isFav = isInWishlist(product.id); 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 bg-white sm:bg-transparent pb-20 sm:pb-0 mt-4">
      <div className="flex flex-col md:flex-row gap-8 bg-white sm:p-6 rounded-sm shadow-sm">
        
        {/* LEFT COLUMN: Images & Action Buttons */}
        <div className="w-full md:w-[40%] flex flex-col gap-4">
          
          <div className="border border-gray-200 rounded-sm relative aspect-[4/5] flex items-center justify-center bg-white group p-4">
            <button 
              onClick={handleWishlistToggle} // <-- Uses protected function
              className={`absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm z-10 transition-colors ${
                isFav ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
            </button>

            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 w-full sm:static sm:w-auto flex gap-2 p-2 sm:p-0 bg-white border-t sm:border-0 z-40 mt-4">
            <button 
              onClick={handleAddToCart} // <-- Uses protected function
              className="flex-1 bg-[#ff9f00] text-white py-4 font-semibold text-lg flex items-center justify-center gap-2 rounded-sm shadow hover:bg-[#e68f00]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
              ADD TO CART
            </button>
            <button 
              onClick={handleBuyNow} // <-- Uses protected function
              className="flex-1 bg-[#fb641b] text-white py-4 font-semibold text-lg flex items-center justify-center gap-2 rounded-sm shadow hover:bg-[#f35b12]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              BUY NOW
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Details */}
        <div className="w-full md:w-[60%] flex flex-col">
          
          <div className="text-xs text-gray-500 mb-2 hidden sm:block">
            Home {'>'} {product.category?.name} {'>'} {product.brand}
          </div>

          <p className="text-gray-500 text-lg font-medium">{product.brand}</p>
          <h1 className="text-xl sm:text-2xl text-gray-900 mt-1">{product.name}</h1>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1">
              {product.rating} <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            </span>
            <span className="text-gray-500 text-sm font-medium">{product.reviews_count} Ratings</span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-semibold text-gray-900">₹{product.price}</span>
            <span className="text-base text-gray-500 line-through mb-1">₹{product.original_price}</span>
            <span className="text-base font-semibold text-green-600 mb-1">{product.discount}% off</span>
          </div>

          {/* Offers */}
          {product.offers && product.offers.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Available offers</h3>
              <ul className="flex flex-col gap-2">
                {product.offers.map((offer, idx) => (
                  <li key={idx} className="text-sm flex gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span>{offer}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-base font-semibold text-gray-500 mb-3">Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-sm font-medium text-sm transition-colors ${selectedSize === size ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Product Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;