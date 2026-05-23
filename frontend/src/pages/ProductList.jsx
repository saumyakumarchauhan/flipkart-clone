import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [priceLimit, setPriceLimit] = useState(150000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  // 1. Fetch from FastAPI
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (categoryQuery) params.append('category', categoryQuery);

        const response = await fetch(`https://flipkart-backend-guta.onrender.com/api/products/?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryQuery]);

  // 2. Apply ALL Filters Locally
  useEffect(() => {
    let result = products.filter(p => p.price <= priceLimit);

    // Apply Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Apply Rating Filter (finds the minimum checked rating, e.g., if "3 & above" is checked, show >= 3)
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      result = result.filter(p => p.rating >= minRating);
    }

    setFilteredProducts(result);
  }, [priceLimit, selectedBrands, selectedRatings, products]);

  // Handlers for Checkboxes
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 flex flex-col md:flex-row gap-4 items-start mt-4">
      
      {/* LEFT SIDEBAR: Filters */}
      <div className="w-full md:w-[25%] bg-white shadow-sm border border-gray-200 rounded-sm sticky top-20">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        
        {/* Price Filter */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold uppercase text-gray-800 mb-4">Price</h3>
          <input 
            type="range" 
            min="0" 
            max="150000" 
            value={priceLimit}
            onChange={(e) => setPriceLimit(Number(e.target.value))}
            className="w-full accent-[#2874f0]" 
          />
          <div className="flex justify-between items-center mt-2">
            <span className="border border-gray-300 px-3 py-1 rounded-sm text-sm bg-gray-50">₹0</span>
            <span className="text-gray-400 text-sm">to</span>
            <span className="border border-gray-300 px-3 py-1 rounded-sm text-sm bg-gray-50">₹{priceLimit}</span>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold uppercase text-gray-800 mb-3">Brand</h3>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {['Puma', 'Apple', 'Sony', 'Nike', 'Samsung', 'LG', 'Bosch', 'Biba', 'Mothercare', 'Wakefit', 'Wildcraft', 'Fossil'].map(brand => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 text-[#2874f0] rounded-sm border-gray-300" 
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer Ratings */}
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase text-gray-800 mb-3">Customer Ratings</h3>
          <div className="flex flex-col gap-2">
            {[4, 3, 2].map(rating => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingToggle(rating)}
                  className="w-4 h-4 text-[#2874f0] rounded-sm border-gray-300" 
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  {rating} <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> & above
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT: Product Grid */}
      <div className="w-full md:w-[75%] bg-white shadow-sm border border-gray-200 rounded-sm">
        
        <div className="p-4 border-b border-gray-200 flex flex-col gap-2">
          <div className="text-xs text-gray-500">
            Home {categoryQuery && `> ${categoryQuery}`}
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            {searchQuery ? `Showing results for "${searchQuery}"` : categoryQuery ? categoryQuery : 'All Products'}
            <span className="text-sm text-gray-500 font-normal ml-2">(Showing {filteredProducts.length} products)</span>
          </h1>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874f0]"></div>
           </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-20 text-center text-gray-500 flex flex-col items-center">
            <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-xl font-medium text-gray-700">Sorry, no results found!</p>
            <p className="text-sm mt-2">Please try modifying your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border-b border-r border-gray-200 hover:shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-shadow relative z-0 hover:z-10 bg-white">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductList;