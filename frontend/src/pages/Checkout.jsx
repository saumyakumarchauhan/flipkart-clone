import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get data passed from Cart.jsx
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // LOGIC: 
  // 1. Check if an address was passed via navigation state from Cart.jsx
  // 2. Fallback to the first address in the User profile
  // 3. Fallback to a default object if both are missing
  const passedAddress = location.state?.updatedAddress;
  const userAddress = passedAddress || 
                      (user?.addresses && user.addresses.length > 0 ? user.addresses[0] : null) || 
                      { name: user?.first_name || "Customer", pincode: "000000", details: "No address added" };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id, 
          payment_method: 'COD',
          shipping_address: {
            name: userAddress.name,
            pincode: userAddress.pincode,
            details: userAddress.details
          }
        })
      });

      if (response.ok) {
        navigate('/orders'); 
      } else {
        const errorData = await response.json();
        alert("Backend Error: " + JSON.stringify(errorData.detail));
        setIsProcessing(false);
      }
    } catch (error) {
      alert("Network error.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10 min-h-[50vh]">
      <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
        <div className="bg-[#2874f0] text-white px-6 py-4 rounded-t-sm">
          <h2 className="font-semibold text-lg">ORDER SUMMARY</h2>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          {/* Now dynamically displaying the address that was passed from Cart */}
          <p className="text-gray-700">Deliver to: <strong>{userAddress.name}</strong> ({userAddress.pincode})</p>
          <p className="text-gray-600 text-sm">{userAddress.details}</p>
          
          <h3 className="text-xl font-semibold text-gray-900 border-t pt-4">
            Total Payable: ₹{totalAmount}
          </h3>
          
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={() => navigate('/cart')} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50">CANCEL</button>
            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="bg-[#fb641b] text-white px-8 py-2 font-medium rounded-sm shadow-sm hover:bg-[#f35b12] disabled:opacity-70"
            >
              {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;