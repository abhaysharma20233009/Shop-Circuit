import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams(); // Get token from the URL parameters
  const navigate = useNavigate(); // Hook to redirect the user after resetting password

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        `/api/v1/users/resetPassword/${token}`,
        { password, passwordConfirm: confirmPassword }
      );
      console.log(response);
      if (response.data.status === 'success') {
        setMessage('Password has been reset successfully!');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Reset Password
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-green-400 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
    </div>
  );
}

export default ResetPassword;
