import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth(); 

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    name: user?.first_name || "Guest",
    pincode: (user?.addresses && user.addresses[0]?.pincode) || "Add Pincode",
    details: (user?.addresses && user.addresses[0]?.details) || "Add delivery address details..."
  });

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalOriginalPrice = cartItems.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  // --- NEW VALIDATION FUNCTION ---
  const handlePlaceOrderClick = () => {
    // Check if the user is still using the default placeholder values
    if (
      address.pincode === "Add Pincode" || 
      address.details === "Add delivery address details..." ||
      address.pincode.trim() === "" || 
      address.details.trim() === ""
    ) {
      alert("Please fill in your delivery address and details before placing the order.");
    } else {
      navigate('/checkout', { state: { updatedAddress: address } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-10 mt-4 flex justify-center">
        <div className="bg-white w-full max-w-4xl p-10 flex flex-col items-center shadow-sm border border-gray-200 rounded-sm">
          <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-64 mb-6" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty!</h2>
          <p className="text-sm text-gray-500 mb-6">Add items to it now.</p>
          <Link to="/" className="bg-[#2874f0] text-white px-16 py-3 shadow-sm rounded-sm font-medium hover:bg-blue-600">
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 flex flex-col lg:flex-row gap-4 items-start mt-4">
      
      <div className="w-full lg:w-[70%] flex flex-col gap-4">
        
        <div className="bg-white p-4 sm:p-6 shadow-sm border border-gray-200 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {isEditingAddress ? (
            <div className="flex flex-col gap-3 w-full sm:w-[80%]">
              <div className="flex gap-4">
                <input type="text" value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} placeholder="Name" className="border px-3 py-1.5 rounded-sm outline-none focus:border-[#2874f0] text-sm w-1/2" />
                <input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} placeholder="Pincode" className="border px-3 py-1.5 rounded-sm outline-none focus:border-[#2874f0] text-sm w-1/2" />
              </div>
              <input type="text" value={address.details} onChange={(e) => setAddress({...address, details: e.target.value})} placeholder="Full Address" className="border px-3 py-1.5 rounded-sm outline-none focus:border-[#2874f0] text-sm w-full" />
              <button onClick={() => setIsEditingAddress(false)} className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-medium w-fit hover:bg-blue-600">Save Address</button>
            </div>
          ) : (
            <>
              <div>
                <span className="text-sm text-gray-500">Deliver to: </span>
                <span className="text-sm font-medium text-gray-900">{address.name}, {address.pincode}</span>
                <p className="text-xs text-gray-500 mt-1">{address.details}</p>
              </div>
              <button onClick={() => setIsEditingAddress(true)} className="text-[#2874f0] border border-gray-200 px-4 py-2 rounded-sm text-sm font-medium hover:shadow-sm">
                Change
              </button>
            </>
          )}
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-sm flex flex-col">
          {cartItems.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-4 w-full sm:w-[20%]">
                <div className="w-24 h-24 flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center text-lg ${item.quantity <= 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-800 hover:bg-gray-50'}`}
                  >
                    -
                  </button>
                  <div className="w-10 h-7 border border-gray-300 flex items-center justify-center text-sm font-medium">
                    {item.quantity}
                  </div>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-800 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col w-full sm:w-[80%]">
                <h3 className="text-gray-900 font-medium text-base hover:text-[#2874f0] cursor-pointer line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                <div className="flex items-end gap-3 mt-4">
                  <span className="text-sm text-gray-500 line-through">₹{item.originalPrice * item.quantity}</span>
                  <span className="text-xl font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  <span className="text-sm font-medium text-green-600">{item.discount}% Off</span>
                </div>
                <div className="mt-6 flex gap-6 text-sm font-medium">
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-900 hover:text-[#2874f0] uppercase">Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-end sticky bottom-0 z-10">
            {/* UPDATED: Calling the new validation function */}
            <button 
              onClick={handlePlaceOrderClick}
              className="bg-[#fb641b] text-white px-12 py-3 rounded-sm font-medium shadow-sm hover:bg-[#f35b12] text-base"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[30%] bg-white shadow-sm border border-gray-200 rounded-sm sticky top-20">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-gray-500 font-medium uppercase text-sm">Price Details</h2>
        </div>
        <div className="p-4 flex flex-col gap-4 border-b border-gray-200 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-800">Price ({totalItems} items)</span>
            <span className="text-gray-800">₹{totalOriginalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-800">Discount</span>
            <span className="text-green-600">- ₹{totalDiscount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-800">Delivery Charges</span>
            <span className="text-green-600">Free</span>
          </div>
        </div>
        <div className="p-4 flex justify-between items-center border-b border-gray-200 border-dashed">
          <span className="text-lg font-semibold text-gray-900">Total Amount</span>
          <span className="text-lg font-semibold text-gray-900">₹{totalPrice}</span>
        </div>
        <div className="p-4">
          <p className="text-green-600 font-medium text-sm">
            You will save ₹{totalDiscount} on this order
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;