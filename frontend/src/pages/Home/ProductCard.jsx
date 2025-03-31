import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import { FiEye, FiShoppingBag, FiPhone, FiTag, FiDollarSign, FiMapPin, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import { useTheme } from "../../store/themeProvider"; // Import Theme Hook

// Animation Variants
const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { delay: 0.1 } },
  exit: { scale: 0.9, opacity: 0 },
};

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme(); // Get theme from context

  if (!product || !product.sellerId) {
    console.error("Incomplete product data passed to ProductCard:", product);
    return null;
  }

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setShowModal(false);
  };

  return (
    <>
      {/* Product Card */}
      <motion.div
        whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(120, 0, 255, 0.3)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-md border border-purple-400/30 flex flex-col"
      >
        <div className="w-full h-52 relative overflow-hidden">
          <img
            src={product.productImage || "https://via.placeholder.com/300x200"}
            alt={product.productName || "Product Image"}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-purple-600/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
            <FiShoppingBag size={12} />
            <span>{product.sellerId.shopName || "Seller"}</span>
          </div>
        </div>

        <div className="p-4 text-gray-200 flex flex-col">
          <h3 className="font-bold text-lg truncate text-cyan-300">{product.productName || "Product Name"}</h3>
          <p className="text-gray-400 text-sm mt-1 h-10 overflow-hidden">{product.description || "No description available."}</p>

          <div className="flex justify-between items-center mt-4 pt-2 border-t border-purple-400/20">
            <p className="text-xl font-semibold text-fuchsia-400 flex items-center">
              <FiDollarSign size={16} className="mr-1" />
              {product.price ? parseFloat(product.price).toFixed(2) : "N/A"}
            </p>
            <div className="flex gap-2">
              

              {/* View Details Button - Opens Modal */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenModal}
                className="px-3 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-lg shadow-md flex items-center gap-1"
              >
                <FiEye size={14} /> Details
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal - Rendered in a Portal */}
      {showModal &&
        ReactDOM.createPortal(
          <AnimatePresence>
            <motion.div
              variants={modalOverlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                variants={modalContentVariants}
                className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md shadow-xl border border-purple-500/50 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white bg-red-500 p-1.5 rounded-full"
                  aria-label="Close details"
                >
                  <FiX size={16} />
                </motion.button>

                {/* Product Info */}
                <h2 className="text-xl font-bold text-cyan-300 mb-1">{product.productName}</h2>
                <p className="text-sm text-fuchsia-400 mb-3">
                  <FiDollarSign size={14} className="inline mr-1" />
                  {product.price ? parseFloat(product.price).toFixed(2) : "N/A"}
                </p>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>

                <div className="h-px bg-purple-400/30 my-4"></div>

                {/* Seller Info */}
                <h3 className="text-purple-300 font-semibold text-base mb-2">Seller Information</h3>
                <p className="flex items-center gap-2">
                  <FiShoppingBag className="text-purple-400" /> {product.sellerId.shopName}
                </p>
                {product.sellerId.shopAddress && (
                  <p className="text-gray-400 flex items-center gap-2">
                    <FiMapPin className="text-purple-400" /> {product.sellerId.shopAddress}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <FiPhone className="text-purple-400" /> {product.sellerId.contactNumber}
                </p>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md"
                >
                  Add to Cart / Contact Seller
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default ProductCard;
