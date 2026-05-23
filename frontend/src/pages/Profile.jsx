import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  // Address States
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', pincode: '', address: '' });

  const DEFAULT_USER_ID = 1;

  // Fetch user data on load
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${DEFAULT_USER_ID}`);
      const data = await response.json();
      setUser(data);
      setEditForm({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        gender: data.gender || 'Male'
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to load user profile");
    }
  };

  const handleProfileSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${DEFAULT_USER_ID}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (response.ok) {
        setIsEditingProfile(false);
        fetchUserData(); // Refresh data
      }
    } catch (err) {
      console.error("Failed to save profile");
    }
  };

  const handleAddressSave = async () => {
    const updatedAddresses = [...(user.addresses || []), newAddress];
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${DEFAULT_USER_ID}/addresses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      if (response.ok) {
        setIsAddingAddress(false);
        setNewAddress({ name: '', phone: '', pincode: '', address: '' });
        fetchUserData();
      }
    } catch (err) {
      console.error("Failed to save address");
    }
  };

  const removeAddress = async (index) => {
    const updatedAddresses = user.addresses.filter((_, i) => i !== index);
    try {
      await fetch(`http://127.0.0.1:8000/api/users/${DEFAULT_USER_ID}/addresses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      fetchUserData();
    } catch (err) {
      console.error("Failed to remove address");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874f0]"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 flex flex-col md:flex-row gap-6 items-start mt-8 pb-20">
      
      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-[25%] flex flex-col gap-4">
        {/* User Badge */}
        <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-sm flex items-center gap-4">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="Profile" className="w-12 h-12" />
          <div>
            <p className="text-xs text-gray-500">Hello,</p>
            <p className="font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-gray-500 font-medium text-sm flex items-center gap-3">
              <svg className="w-5 h-5 text-[#2874f0]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
              ACCOUNT SETTINGS
            </h3>
            <div className="flex flex-col mt-2 pl-8">
              <button onClick={() => setActiveTab('profile')} className={`text-left py-2 text-sm font-medium hover:text-[#2874f0] ${activeTab === 'profile' ? 'text-[#2874f0] bg-blue-50' : 'text-gray-700'}`}>Profile Information</button>
              <button onClick={() => setActiveTab('addresses')} className={`text-left py-2 text-sm font-medium hover:text-[#2874f0] ${activeTab === 'addresses' ? 'text-[#2874f0] bg-blue-50' : 'text-gray-700'}`}>Manage Addresses</button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-full md:w-[75%] bg-white shadow-sm border border-gray-200 rounded-sm p-6 sm:p-8 min-h-[500px]">
        
        {/* TAB 1: Profile Information */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-8">
            {/* Personal Info */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                {!isEditingProfile && <button onClick={() => setIsEditingProfile(true)} className="text-sm font-medium text-[#2874f0]">Edit</button>}
              </div>
              
              <div className="flex gap-4">
                <input type="text" disabled={!isEditingProfile} value={editForm.first_name} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} className="border px-4 py-2.5 rounded-sm outline-none focus:border-[#2874f0] bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-transparent w-64" />
                <input type="text" disabled={!isEditingProfile} value={editForm.last_name} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} className="border px-4 py-2.5 rounded-sm outline-none focus:border-[#2874f0] bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-transparent w-64" />
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">Your Gender</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="radio" name="gender" disabled={!isEditingProfile} checked={editForm.gender === 'Male'} onChange={() => setEditForm({...editForm, gender: 'Male'})} className="text-[#2874f0]" /> Male
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="radio" name="gender" disabled={!isEditingProfile} checked={editForm.gender === 'Female'} onChange={() => setEditForm({...editForm, gender: 'Female'})} className="text-[#2874f0]" /> Female
                  </label>
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Email Address</h2>
              <input type="email" disabled={!isEditingProfile} value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="border px-4 py-2.5 rounded-sm outline-none focus:border-[#2874f0] bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-transparent w-64" />
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Mobile Number</h2>
              <input type="tel" disabled={!isEditingProfile} value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="border px-4 py-2.5 rounded-sm outline-none focus:border-[#2874f0] bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-transparent w-64" />
            </div>

            {/* Save Button */}
            {isEditingProfile && (
              <button onClick={handleProfileSave} className="bg-[#2874f0] text-white px-10 py-3 rounded-sm font-medium hover:bg-blue-600 w-fit mt-4 shadow-sm">
                SAVE
              </button>
            )}
          </div>
        )}

        {/* TAB 2: Manage Addresses */}
        {activeTab === 'addresses' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-medium text-gray-900 pb-4 border-b">Manage Addresses</h2>
            
            {!isAddingAddress ? (
              <button onClick={() => setIsAddingAddress(true)} className="border border-gray-300 text-[#2874f0] font-medium py-3 px-4 flex items-center gap-2 hover:bg-blue-50 transition-colors w-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                ADD A NEW ADDRESS
              </button>
            ) : (
              <div className="bg-blue-50 p-6 border border-blue-100 flex flex-col gap-4">
                <h3 className="text-[#2874f0] font-medium text-sm">ADD A NEW ADDRESS</h3>
                <div className="flex gap-4">
                  <input type="text" placeholder="Name" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} className="border px-4 py-2 outline-none focus:border-[#2874f0] w-1/2 bg-white" />
                  <input type="text" placeholder="10-digit mobile number" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className="border px-4 py-2 outline-none focus:border-[#2874f0] w-1/2 bg-white" />
                </div>
                <div className="flex gap-4">
                  <input type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} className="border px-4 py-2 outline-none focus:border-[#2874f0] w-1/2 bg-white" />
                </div>
                <textarea placeholder="Address (Area and Street)" value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} className="border px-4 py-2 outline-none focus:border-[#2874f0] w-full h-24 resize-none bg-white"></textarea>
                
                <div className="flex gap-4 mt-2">
                  <button onClick={handleAddressSave} className="bg-[#2874f0] text-white px-8 py-3 rounded-sm font-medium hover:bg-blue-600 shadow-sm">SAVE</button>
                  <button onClick={() => setIsAddingAddress(false)} className="text-[#2874f0] px-8 py-3 font-medium hover:bg-blue-100">CANCEL</button>
                </div>
              </div>
            )}

            {/* List Saved Addresses */}
            <div className="flex flex-col gap-4 mt-4">
              {user.addresses && user.addresses.map((addr, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-sm flex justify-between group bg-white">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-semibold text-sm">{addr.name}</span>
                      <span className="text-sm font-medium">{addr.phone}</span>
                    </div>
                    <p className="text-sm text-gray-700">{addr.address} - <span className="font-medium">{addr.pincode}</span></p>
                  </div>
                  <button onClick={() => removeAddress(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;