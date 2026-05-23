import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Sending data to your FastAPI backend!
      const response = await fetch('http://127.0.0.1:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! Please login.");
        navigate('/login'); // Redirect to login page
      } else {
        setError(data.detail || 'Something went wrong');
      }
    } catch (err) {
      setError('Cannot connect to server. Is backend running?');
    }
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-[850px] bg-white shadow-md rounded-sm overflow-hidden">
        
        {/* Left Blue Sidebar */}
        <div className="bg-[#2874f0] w-full md:w-[40%] p-8 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-3xl font-semibold mb-4">Looks like you're new here!</h1>
            <p className="text-lg text-gray-200">Sign up with your mobile number to get started</p>
          </div>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Signup Illustration" className="mt-8 object-contain" />
        </div>

        {/* Right Form Area */}
        <div className="w-full md:w-[60%] p-8 sm:p-10 flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow">
            
            <div className="flex gap-4">
              <input type="text" placeholder="First Name" required 
                value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" />
              <input type="text" placeholder="Last Name" required 
                value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" />
            </div>

            <input type="email" placeholder="Enter Email" required 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" />
            
            <input type="tel" placeholder="Enter Mobile Number" required 
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" />

            <div className="flex gap-4 items-center mt-2">
              <span className="text-sm text-gray-500">Gender:</span>
              <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={(e) => setFormData({...formData, gender: e.target.value})} /> Male</label>
              <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={(e) => setFormData({...formData, gender: e.target.value})} /> Female</label>
            </div>

            <input type="password" placeholder="Set Password" required 
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#2874f0]" />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <p className="text-xs text-gray-500 mt-4">By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.</p>
            <button type="submit" className="bg-[#fb641b] text-white py-3 rounded-sm font-semibold shadow-sm text-lg mt-2 hover:bg-[#f35b12]">CONTINUE</button>
          </form>

          <Link to="/login" className="bg-white text-[#2874f0] border border-gray-200 py-3 rounded-sm font-semibold shadow-sm text-center w-full mt-4 hover:shadow-md">
            Existing User? Log in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;