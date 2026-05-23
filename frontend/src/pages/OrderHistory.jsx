import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- NEW: States for the Checkbox Filters ---
  const [filterOnTheWay, setFilterOnTheWay] = useState(false);
  const [filterConfirmed, setFilterConfirmed] = useState(true); // Checked by default

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/orders/1'); // Fetch for user ID 1
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // --- NEW: Advanced Search & Status Filtering ---
  const filteredOrders = orders
    .map((order) => {
      const searchLower = searchTerm.toLowerCase();
      // 1. Filter the items *inside* the order so non-matching items hide
      const matchedItems = order.items.filter(item =>
        item.product_name.toLowerCase().includes(searchLower) ||
        item.brand.toLowerCase().includes(searchLower)
      );
      // Return the order with only the matched items
      return { ...order, items: matchedItems };
    })
    .filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      
      // 2. Keep the order if the Order ID matches, or if it still has matching items inside it
      const matchesSearch = order.id.toLowerCase().includes(searchLower) || order.items.length > 0;

      // 3. Apply the Checkbox Status logic
      let matchesStatus = false;
      if (filterConfirmed && (order.status === 'Order Confirmed' || order.status === 'Delivered')) {
        matchesStatus = true;
      }
      if (filterOnTheWay && order.status === 'On the way') {
        matchesStatus = true;
      }

      // Final result must pass BOTH search and status checks
      return matchesSearch && matchesStatus;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 flex flex-col md:flex-row gap-6 items-start mt-4 pb-20">
      
      {/* Left Sidebar - Filters */}
      <div className="hidden md:block w-[25%] bg-white shadow-sm border border-gray-200 rounded-sm p-4 sticky top-20">
        <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Filters</h2>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium uppercase text-gray-500">Order Status</h3>
          
          {/* Functional Checkboxes */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filterOnTheWay}
              onChange={(e) => setFilterOnTheWay(e.target.checked)}
              className="w-4 h-4 text-[#2874f0]" 
            />
            <span className="text-sm text-gray-700">On the way</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filterConfirmed}
              onChange={(e) => setFilterConfirmed(e.target.checked)}
              className="w-4 h-4 text-[#2874f0]" 
            />
            <span className="text-sm text-gray-700">Delivered / Confirmed</span>
          </label>

        </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-[75%] flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-sm flex gap-4">
          <input 
            type="text" 
            placeholder="Search your orders here" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-sm px-4 py-2 outline-none focus:border-[#2874f0]"
          />
          <button className="bg-[#2874f0] text-white px-8 py-2 font-medium rounded-sm shadow-sm hover:bg-blue-600">
            Search Orders
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center p-10">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874f0]"></div>
           </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-10 text-center border border-gray-200 rounded-sm shadow-sm">
            <p className="text-lg font-medium text-gray-700">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white shadow-sm border border-gray-200 rounded-sm overflow-hidden mb-2">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">ORDER PLACED: </span>
                  <span className="text-sm font-medium text-gray-900">{order.dateText}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">TOTAL: </span>
                  <span className="text-sm font-medium text-gray-900">₹{order.total_amount}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">ORDER # </span>
                  <span className="text-sm font-medium text-gray-900">{order.id}</span>
                </div>
              </div>
              
              {/* List out only the items that passed the search filter */}
              {order.items.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6 w-full sm:w-[50%]">
                    <div className="w-20 h-20 bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center p-2">
                      <img src={item.image_url} alt={item.product_name} className="max-h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium line-clamp-2 group-hover:text-[#2874f0]">{item.product_name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.brand} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="w-full sm:w-[15%] text-left sm:text-center font-medium text-gray-900">₹{item.price}</div>
                  <div className="w-full sm:w-[35%] flex flex-col items-start sm:items-end">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                      <span className="font-semibold text-green-600">{order.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default OrderHistory;