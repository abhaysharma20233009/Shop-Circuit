import React, { useState } from 'react';


const AccountSettings = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailUpdate = async(e) => {
    e.preventDefault();
    // Handle email update logic
    const data={email:email}
    try {
        const res = await fetch('/api/v1/users/updateMe', {
            method: 'PATCH',
            credentials: 'include', // Ensures cookies are sent if needed
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
        const response=await res.json();
        console.log('response ', response.status);
        if (response.status === 'success') {
            alert('email updated successfully!');
        }
        // return [];
      } catch (err) {
       
        console.log('Error:', err.response?.data?.message || err.message);
        // return [];
      }
   
  };

 
  const handlePasswordUpdate =async (e) => {
    e.preventDefault();

    const data = {
      passwordCurrent: password,
      password: newPassword,
      passwordConfirm: confirmPassword,
    };
    try {
        const res = await fetch('/api/v1/users/updateMyPassword', {
          method: 'PATCH',
          credentials: 'include', // Ensures cookies are sent if needed
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      
        const responseData = await res.json();
        console.log('response ', responseData);
      
        if (responseData.status === 'success') {
            alert('Password updated successfully!');
        }
      } catch (err) {
        console.log('Error:', err.message);
      }
      
    
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>

        {/* Email Section */}
        <form onSubmit={handleEmailUpdate} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-zinc-600 border border-zinc-500 rounded-lg text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            Update Email
          </button>
        </form>
       
        {/* Password Section */}
        <form onSubmit={handlePasswordUpdate} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-zinc-600 border border-zinc-500 rounded-lg text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-zinc-600 border border-zinc-500 rounded-lg text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-zinc-600 border border-zinc-500 rounded-lg text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
