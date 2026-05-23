import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  
  // We grab the state passed from the Checkout page. 
  // If someone visits this URL directly, we provide fallback dummy data.
  const { paymentMethod, orderId } = location.state || { 
    paymentMethod: 'COD', 
    orderId: 'OD-' + Math.floor(1000000000 + Math.random() * 9000000000) 
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-12 flex flex-col items-center justify-center">
      <div className="bg-white w-full p-10 shadow-sm rounded-sm border border-gray-200 flex flex-col items-center text-center">
        
        {/* Festive Icons / Checkmark */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-4xl">🎉</span>
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="text-4xl">🎊</span>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-lg font-medium text-gray-600 mb-6">Order ID: {orderId}</p>

        {/* Conditional Payment Message */}
        <div className="bg-gray-50 border border-gray-200 w-full max-w-md p-4 rounded-sm mb-8">
          {paymentMethod === 'COD' ? (
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Cash on Delivery</h3>
              <p className="text-sm text-gray-600">Please keep the exact change ready at the time of delivery. You can also pay via UPI to the delivery executive.</p>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-green-600 mb-1">Payment Successful</h3>
              <p className="text-sm text-gray-600">Your card payment was processed securely. A detailed receipt has been sent to your registered email.</p>
            </div>
          )}
        </div>

        {/* Continue Shopping Button */}
        <Link 
          to="/" 
          className="bg-[#2874f0] text-white font-medium py-3 px-10 rounded-sm shadow-sm hover:bg-blue-600 transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;