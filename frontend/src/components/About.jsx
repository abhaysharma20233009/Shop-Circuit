import { use } from "react";
import { FaStore, FaExchangeAlt, FaComments, FaPhoneAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function AboutPage() {
  const navigate=useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* Main Heading */}
      <h1 className="text-4xl font-bold mb-6 text-blue-400 animate-pulse">🏫 About College Marketplace</h1>

      {/* Introduction */}
      <p className="text-gray-400 text-lg mb-6 text-center max-w-4xl">
        Welcome to <span className="text-blue-500 font-semibold">College Marketplace</span> – your one-stop platform for all student needs! Find out what products are available in 
        <strong> shops & canteens</strong>, <strong>buy, sell, or rent</strong> items, and easily 
        <strong> connect with other students or shop owners</strong>.
      </p>

      {/* Core Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Shop Listings */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:scale-105 transition transform duration-300">
          <FaStore className="text-5xl text-yellow-400 mb-4" />
          <h2 className="text-2xl font-semibold text-white">Shop & Canteen Listings</h2>
          <p className="text-gray-400 mt-2">Easily check <strong>what products are available</strong> in college shops and canteens.</p>
        </div>

        {/* Buy, Sell, Rent */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:scale-105 transition transform duration-300">
          <FaExchangeAlt className="text-5xl text-green-400 mb-4" />
          <h2 className="text-2xl font-semibold text-white">Buy, Sell, Rent</h2>
          <p className="text-gray-400 mt-2">Students can <strong>sell, buy, or rent</strong> items directly on the platform.</p>
        </div>

        {/* Chat System */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:scale-105 transition transform duration-300">
          <FaComments className="text-5xl text-blue-400 mb-4" />
          <h2 className="text-2xl font-semibold text-white">Instant Chat</h2>
          <p className="text-gray-400 mt-2">Contact other students easily using our <strong>built-in chat feature</strong>.</p>
        </div>

        {/* Contact Shops */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:scale-105 transition transform duration-300">
          <FaPhoneAlt className="text-5xl text-red-400 mb-4" />
          <h2 className="text-2xl font-semibold text-white">Direct Shop Contact</h2>
          <p className="text-gray-400 mt-2">Get shop <strong>phone numbers</strong> for quick and easy purchases.</p>
        </div>

        {/* Community Engagement */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:scale-105 transition transform duration-300">
          <FaUsers className="text-5xl text-purple-400 mb-4" />
          <h2 className="text-2xl font-semibold text-white">Student Community</h2>
          <p className="text-gray-400 mt-2">Join a <strong>trusted network</strong> of students for buying, selling, and renting.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-semibold text-blue-400">🚀 Get Started Today!</h2>
        <p className="text-gray-400 mt-4 text-lg">Join the <strong>College Marketplace</strong> now to buy, sell, rent, and connect with your peers easily.</p>
        <button className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition" onClick={() => handleNavigation("/dashboard")}>
          Start Now
        </button>
      </div>
    </div>
  );
}
