import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#03001e] via-[#1e0c2b] to-[#190213] text-white py-10 mt-10 relative overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* Brand & About */}
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-xl shadow-md border border-gray-900">
          <h2 className="text-2xl font-extrabold text-gray-400">Shop Circuit</h2>
          <p className="mt-2 text-gray-300">
            Your one-stop destination for buying, renting, and selling products with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-xl shadow-md border border-gray-900">
          <h2 className="text-lg font-semibold text-gray-300">Quick Links</h2>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:text-purple-400 transition-all duration-300">Home</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-all duration-300">Products</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-all duration-300">Rent Items</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-all duration-300">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-xl shadow-md border border-gray-900">
          <h2 className="text-lg font-semibold text-gray-300">Follow Us</h2>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="text-gray-300 hover:text-purple-400 transition-all duration-300"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-300 hover:text-purple-400 transition-all duration-300"><FaTwitter size={24} /></a>
            <a href="#" className="text-gray-300 hover:text-purple-400 transition-all duration-300"><FaInstagram size={24} /></a>
            <a href="#" className="text-gray-300 hover:text-purple-400 transition-all duration-300"><FaLinkedin size={24} /></a>
          </div>
          <p className="mt-3 text-gray-300">Email: support@shopcircuit.com</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} Shop Circuit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
