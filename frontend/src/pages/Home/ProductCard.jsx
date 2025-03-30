import React, { useState } from "react";
import { FaComments } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative w-full max-w-xs h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group cursor-pointer bg-gray-900 bg-opacity-80 backdrop-blur-md border border-gray-700">
      {/* Product Image */}
      <div className="w-full h-52 relative">
        <img
          src={product.productImage}
          alt={product.productName}
          className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-300"></div>

        {/* Seller Info */}
        <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-md">
          {product.sellerId.shopName}
        </div>
        <div className="absolute top-2 left-2 mt-8 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-md">
          {product.sellerId.contactNumber}
        </div>

        {/* Sale Tag */}
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          SALE
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 text-gray-200">
        <h3 className="font-bold text-lg truncate">{product.productName}</h3>
        <p className="text-gray-400 text-sm mt-1 h-12 overflow-hidden line-clamp-2">
          {product.description}
        </p>

        {/* Price & CTA */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-semibold text-green-400">${product.price}</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition transform hover:scale-105 shadow-md"
            >
              <FaComments className="text-lg" />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition transform hover:scale-105 shadow-md hover:shadow-gray-500/50"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal Inside the Card */}
      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center rounded-xl">
          <div className="bg-gray-800 text-white p-4 rounded-lg w-72 shadow-lg border border-gray-700 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-white bg-red-500 px-2 py-1 rounded-full text-xs hover:bg-red-600"
            >
              ✕
            </button>

            {/* Product Info */}
            <h2 className="text-lg font-bold">{product.productName}</h2>
            <p className="text-gray-400 text-sm mt-2">
              {product.description}
            </p>

            {/* Shop Info */}
            <div className="mt-4">
              <h3 className="text-blue-400 font-semibold">Shop Details</h3>
              <p className="text-sm">🏪 {product.sellerId.shopName}</p>
              <p className="text-sm">Address: {product.sellerId.shopAddress}</p>
              <p className="text-sm">📞 {product.sellerId.contactNumber}</p>
            </div>

            {/* Price */}
            <p className="text-lg font-semibold text-green-400 mt-4">${product.price}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
