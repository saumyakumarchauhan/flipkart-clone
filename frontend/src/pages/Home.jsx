import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';

const Home = () => {
  // 1. State to hold our live database products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data from FastAPI when the page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://flipkart-backend-guta.onrender.com/api/products/');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data); // Save the 12 live products to state
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 pb-8 mt-4">
      
      {/* --- REPLACED: Live Auto-Sliding Banner Component --- */}
      <Banner />

      <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-sm">
        
        {/* Header section */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Suggested For You</h2>
          <div className="bg-[#2874f0] text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        {/* Handling Loading and Errors */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874f0]"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">Error: {error}</div>
        ) : (
          /* Live Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;