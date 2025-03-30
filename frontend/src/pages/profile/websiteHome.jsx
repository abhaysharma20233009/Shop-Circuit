import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductData } from "../../store/productDataStore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LoadingPage from "../../components/Loading";

export default function HomePage() {
  const { products, loading } = useProductData();
  const navigate = useNavigate();

  console.log("Loading State:", loading); // Debugging log

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03001e] via-[#7303c0] to-[#1b0314] text-white flex flex-col items-center">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-center py-20 w-full bg-white/10 backdrop-blur-lg shadow-xl rounded-b-3xl border border-purple-400"
      >
        <h1 className="text-5xl font-extrabold text-purple-300">🚀 Welcome to Shop Circuit</h1>
        <p className="text-lg mt-2 text-gray-300">Buy & Sell Easily, Just Like OLX</p>
      </motion.div>

      {/* Login & Signup Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex gap-6 mt-10"
      >
        <button 
          onClick={() => navigate("/login")} 
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl text-lg shadow-lg hover:from-green-600 hover:to-green-800 transition-all"
        >
          Login
        </button>
        <button 
          onClick={() => navigate("/signup")} 
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          Signup
        </button>
      </motion.div>

      {/* Product Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 mt-10 w-full max-w-7xl">
        {loading ? (
          <LoadingPage />
        ) : (
          products.length > 0 ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="text-gray-300 text-center col-span-full">No products available.</p>
          )
        )}
      </div>
    </div>
  );
}

// Product Card Component
const ProductCard = ({ product }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white/10 backdrop-blur-lg p-5 rounded-xl shadow-xl border border-purple-400 hover:scale-105 transition-all"
  >
    <img
      src={product.productImage}
      alt={product.productName}
      className="w-full h-40 object-cover rounded-md"
    />
    <h3 className="text-xl font-semibold mt-3 text-purple-300">{product.productName}</h3>
    <p className="text-gray-300">{product.category}</p>
    <p className="text-blue-400 font-bold mt-2">${product.price}</p>
    <button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all">
      View Details
    </button>
  </motion.div>
);
