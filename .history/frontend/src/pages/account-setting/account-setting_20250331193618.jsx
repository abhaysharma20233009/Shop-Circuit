import React, { useState } from 'react';
import updateProfileField from '../../api/accountSettings/updateProfileField';
import updatePassword from '../../api/accountSettings/updatePassword';
const AccountSettings = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    // Handle email update logic
    updateProfileField({ email: email });
  };

  const handleUsernameUpdate = (e) => {
    e.preventDefault();
    // Handle username update logic
    updateProfileField({ name: username });
    alert(`Username updated to: ${username}`);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    updatePassword({
      passwordCurrent: password,
      password: newPassword,
      passwordConfirm: confirmPassword,
    });
    // Handle password update logic
    alert('Password updated successfully!');
  };

  return (
    <div className="min-h-screen bg-zinc-800 text-white p-6">
      <div className="max-w-lg mx-auto bg-zinc-700 p-8 rounded-lg shadow-lg">
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

        {/* Username Section */}
        <form onSubmit={handleUsernameUpdate} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-zinc-600 border border-zinc-500 rounded-lg text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            Update Username
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
