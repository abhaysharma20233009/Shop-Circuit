import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

import { useData } from "../store/userDataStore";
export default function ContactPage() {
   const { user, loading } = useData();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ submitted: false, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, error: null });

    try {
      const response = await fetch("http://localhost:3000/api/v1/admin/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: user.username, email: user.email, message }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus({ submitted: true, error: null });
        setMessage(""); // Reset message field
      } else {
        setStatus({ submitted: false, error: data.message || "Something went wrong!" });
      }
    } catch (error) {
      setStatus({ submitted: false, error: "Failed to send message. Please try again later." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400 animate-pulse">📞 Contact Us</h1>
      <p className="text-gray-400 text-lg mb-6 text-center">We'd love to hear from you! Reach out to us with any questions or feedback.</p>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {status.submitted ? (
          <div className="text-center text-green-400 text-lg font-semibold">
            ✅ Thank you for reaching out! We'll get back to you soon.
          </div>
        ) : (
          <>
            {status.error && <p className="text-center text-red-500">{status.error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display user's name and email */}
              <p className="text-gray-300"><strong>Username:</strong> {user.username}</p>
              <p className="text-gray-300"><strong>Email:</strong> {user.email}</p>

              {/* Message input */}
              <textarea 
                name="message"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              ></textarea>

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
                <FaPaperPlane /> Send Message
              </button>
            </form>
          </>
        )}
      </div>

      <div className="mt-10 text-gray-400 text-lg">
        <p className="flex items-center gap-2"><FaPhone className="text-yellow-400" /> +91 123 456 7890</p>
        <p className="flex items-center gap-2 mt-2"><FaEnvelope className="text-red-400" /> contact@swiskills.com</p>
        <p className="flex items-center gap-2 mt-2"><FaMapMarkerAlt className="text-green-400" /> 123 Tech Street, Delhi, India</p>
      </div>
    </div>
  );
}
