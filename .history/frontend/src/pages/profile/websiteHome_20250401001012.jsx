import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductData } from "../../store/productDataStore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LoadingPage from "../../components/Loading"; // Assuming you have a styled LoadingPage
import { FiLogIn, FiUserPlus, FiEye, FiGrid } from "react-icons/fi"; // Example icons

// Framer Motion Variants for staggering children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger effect for product cards
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


export default function HomePage() {
  const { products, loading } = useProductData();
  const navigate = useNavigate();

  console.log("Loading State:", loading); // Debugging log

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a031a] via-[#1a0433] to-[#05010d] text-gray-200 flex flex-col items-center overflow-x-hidden">

      {/* Hero Section - Enhanced Glassmorphism and Glow */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center py-16 md:py-24 w-full bg-black/20 backdrop-blur-xl shadow-2xl shadow-purple-900/30 border-b border-purple-500/30"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
          <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text">
             🚀 Shop Circuit
          </span>
        </h1>
        <p className="text-lg sm:text-xl mt-3 text-gray-400 font-light tracking-wider">
          Next-Gen P2P Marketplace
        </p>
      </motion.div>

      {/* Login & Signup Buttons - Futuristic Style */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        className="flex flex-col sm:flex-row gap-5 mt-12 z-10"
      >
        <button
          onClick={() => navigate("/login")}
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium tracking-wide text-white transition duration-300 ease-out border-2 border-cyan-500 rounded-lg shadow-md group hover:shadow-cyan-500/50"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-cyan-600 group-hover:translate-x-0 ease">
            <FiLogIn className="w-6 h-6" />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-cyan-400 transition-all duration-300 transform group-hover:translate-x-full ease">
            Login
          </span>
          <span className="relative invisible">Login</span> {/* For sizing */}
        </button>

        <button
          onClick={() => navigate("/signup")}
           className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium tracking-wide text-white transition duration-300 ease-out border-2 border-fuchsia-500 rounded-lg shadow-md group hover:shadow-fuchsia-500/50"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-fuchsia-600 group-hover:translate-x-0 ease">
            <FiUserPlus className="w-6 h-6" />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-fuchsia-400 transition-all duration-300 transform group-hover:translate-x-full ease">
            Signup
          </span>
          <span className="relative invisible">Signup</span> {/* For sizing */}
        </button>
      </motion.div>

       {/* Product Listings Section Header */}
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center mt-16 mb-6"
       >
        <h2 className="text-3xl font-bold text-gray-300 flex items-center justify-center gap-2">
          <FiGrid className="text-purple-400"/> Featured Listings
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-fuchsia-500 to-cyan-400 mx-auto mt-2 rounded-full"></div>
       </motion.div>


      {/* Product Listings - Grid with Stagger Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 p-6 md:p-8 w-full max-w-screen-xl mx-auto"
      >
        {loading ? (
          // Ensure LoadingPage component is also styled futuristically
          <div className="col-span-full flex justify-center items-center min-h-[300px]">
             <LoadingPage />
          </div>
        ) : (
          products.length > 0 ? (
            products.slice(0, 12).map((product)  => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center col-span-full text-lg mt-10"
            >
              No products found. Be the first to list!
            </motion.p>
          )
        )}
      </motion.div>
    </div>
  );
}

// Product Card Component - Enhanced Style
const ProductCard = ({ product }) => {
  const navigate = useNavigate(); // Added for potential navigation

  // Placeholder: Navigate to a product detail page
  const handleViewDetails = () => {
     // navigate(`/product/${product.id}`); // Example navigation
     toast.info(`Viewing details for ${product.productName}`); // Placeholder action
  }

  return (
  <motion.div
    variants={itemVariants} // Use item variant for stagger effect
    whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(120, 0, 255, 0.3)" }} // Subtle lift and glow on hover
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-md p-5 rounded-xl shadow-lg border border-purple-400/30 overflow-hidden flex flex-col h-full cursor-pointer group"
    onClick={handleViewDetails} // Make the whole card clickable
  >
    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
        <img
          src={product.productImage || "https://via.placeholder.com/300x200/1a1a2e/808080?text=No+Image"} // Fallback image
          alt={product.productName}
          className="w-full h-full object-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-110" // Zoom effect on hover
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
    </div>

    <div className="flex flex-col flex-grow"> {/* flex-grow to push button down */}
      <h3 className="text-xl font-semibold mb-1 text-cyan-300 truncate group-hover:text-cyan-200 transition-colors">
        {product.productName}
      </h3>
      <p className="text-sm text-purple-300 mb-2">{product.category}</p>
      <p className="text-lg font-bold text-fuchsia-400 mt-auto mb-3"> {/* mt-auto pushes price down */}
         {product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'Price not set'}
      </p>

      {/* Removed the separate button, card is clickable */}
      {/* Optional: Add a subtle indicator */}
      <div className="flex items-center justify-center text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
        <FiEye className="mr-1"/> Click to view
      </div>
    </div>

     {/* Optional: Add a subtle bottom border glow */}
     <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

  </motion.div>
)};
