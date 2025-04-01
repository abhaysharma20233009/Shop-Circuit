import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ submitted: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, error: null });

    try {
      const response = await fetch("/api/v1/admin/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus({ submitted: true, error: null });
        setFormData({ name: "", email: "", message: "" }); // Reset form
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
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
              
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
              
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} rows="5" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required></textarea>
              
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
