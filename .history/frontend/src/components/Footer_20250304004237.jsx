import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useProductData } from "../store/productDataStore";

const Footer = () => {
  const { products, loading } = useProductData();

  // Categorize products dynamically
  const categories = [...new Set(products.map(product => product.category))];

  console.log("Filtered Categories:", categories);

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

        {/* Display Filtered Products by Category */}
        <div>
          <h2 className="text-lg font-semibold text-white">Products by Category</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            categories.map((category) => (
              <div key={category} className="mt-4">
                <h3 className="text-md font-semibold text-gray-200">{category}</h3>
                <ul className="text-gray-400 space-y-1">
                  {products
                    .filter(product => product.category === category)
                    .slice(0, 3) // Limit to 3 products per category
                    .map(product => (
                      <li key={product._id} className="hover:text-white">
                        {product.productName} - ${product.price}
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))
          )}
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
