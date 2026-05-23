import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  
  // You correctly pulled this in!
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // --- NEW: Trigger the context to save the user globally! ---
        login(data.user);
        
        console.log("Logged in user:", data.user);
        alert(`Welcome back, ${data.user.name}!`);
        navigate('/'); // Redirect to Dashboard/Home
      } else {
        setError(data.detail || 'Invalid credentials');
      }
    } catch (err) {
      setError('Cannot connect to server. Is backend running?');
    }
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-[850px] bg-white shadow-md rounded-sm overflow-hidden min-h-[500px]">
        
        {/* Left Blue Sidebar */}
        <div className="bg-[#2874f0] w-full md:w-[40%] p-8 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-3xl font-semibold mb-4">Login</h1>
            <p className="text-lg text-gray-200">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login Illustration" className="mt-8 object-contain" />
        </div>

        {/* Right Form Area */}
        <div className="w-full md:w-[60%] p-8 sm:p-10 flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow">
            
            <input type="email" placeholder="Enter Email" required 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" />
            
            <input type="password" placeholder="Enter Password" required 
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <p className="text-xs text-gray-500 mt-4">By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.</p>
            <button type="submit" className="bg-[#fb641b] text-white py-3 rounded-sm font-semibold shadow-sm text-lg mt-2 hover:bg-[#f35b12]">Login</button>
          </form>

          <Link to="/signup" className="text-[#2874f0] text-center font-medium mt-auto pb-4 hover:underline">
            New to Flipkart? Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;