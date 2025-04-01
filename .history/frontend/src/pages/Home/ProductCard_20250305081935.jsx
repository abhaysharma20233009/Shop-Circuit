import productpic from "../../assets/productImg.jpg";
import { useState } from "react";
import React from "react";

const ProductCard = ({ product }) => {
 
  
  return (
    <div>
      
    <div className="relative w-full max-w-xs h-80 overflow-hidden rounded-lg group cursor-pointer shadow-md hover:shadow-lg transition-shadow">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${productpic})` }}
      />

      {/* Overlay to darken the image slightly */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Top Left - Seller Name */}
      <div className="absolute top-2 left-2 mb-5 bg-white/80 text-xs font-semibold px-3 py-1 rounded-full">
  {product.sellerId.shopName}
</div>
<div className="absolute top-2 left-2 bg-white/80 text-xs font-semibold px-3 py-1 rounded-full">
  {product.sellerId.contactNumber}
</div>


      {/* Top Right - Sale Tag */}
      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
        SALE
      </div>

      {/* Hover Details */}
      <div className="absolute bottom-0 left-0 w-full bg-white/90 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-bold text-lg">{product.productName}</h3>
        <p className="text-gray-700 text-sm line-clamp-2">{product.description}</p>
        <p className="mt-2 font-semibold text-green-600">${product.price}</p>
      </div>

    </div>
    </div>
  );
};

export default ProductCard;
