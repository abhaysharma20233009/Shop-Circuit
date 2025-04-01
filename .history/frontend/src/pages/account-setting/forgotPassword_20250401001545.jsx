import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/v1/users/forgotPassword', {
        email,
      });
      if (response.data.status === 'success') {
        setMessage('A password reset link has been sent to your email.');
      }
    } catch (err) {
      setError(
        'Failed to send reset link. Please check your email and try again.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Forgot Password
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-4 text-green-400 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
    </div>
  );
}

export default ForgotPassword;
