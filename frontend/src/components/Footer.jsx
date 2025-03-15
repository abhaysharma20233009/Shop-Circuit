import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand & About */}
        <div>
          <h2 className="text-xl font-bold text-white">Shop Circuit</h2>
          <p className="mt-2 text-gray-400">
            Your one-stop destination for buying, renting, and selling products with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white">Quick Links</h2>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Products</a></li>
            <li><a href="#" className="hover:text-white">Rent Items</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h2 className="text-lg font-semibold text-white">Follow Us</h2>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={20} /></a>
          </div>
          <p className="mt-3 text-gray-400">Email: support@shopcircuit.com</p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Shop Circuit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
