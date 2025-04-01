import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import LoadingPage from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import {
  FiX,
  FiDollarSign,
  FiShoppingBag,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

export default function ProductList() {
  const navigate = useNavigate();
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/admin/products",
          { withCredentials: true }
        );
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products!");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getFilteredProducts = () => {
    if (searchQuery.trim() === "") return products;
    return products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/admin/product/${id}`, {
        withCredentials: true,
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product!");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 p-3 rounded-lg shadow-lg">
        <h1 className="text-white text-xl font-bold mb-3 md:mb-0">
          🔍 Search Products
        </h1>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full p-2 pl-10 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all">
            <FaSearch />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingPage />
      ) : (
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            🛍 All Products
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {getFilteredProducts()
              .slice(0, visibleProducts)
              .map((product) => (
                <div
                  key={product._id}
                  className="relative w-full max-w-xs h-96 bg-gray-900 rounded-xl shadow-lg p-4"
                >
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-full h-52 object-cover rounded-t-xl"
                  />
                  {product.sellerId?.shopName && (
                    <h3 className="text-lg font-bold text-white mt-2 truncate">
                      {product.sellerId.shopName}
                    </h3>
                  )}
                  {product.sellerId?.hostelName && (
                    <h3 className="text-lg font-bold text-white mt-2 truncate">
                      {product.sellerId.hostelName}
                    </h3>
                  )}
                  <h3 className="text-lg font-bold text-white mt-2 truncate">
                    {product.productName}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 h-12 overflow-hidden line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-semibold text-green-400">
                      ${product.price}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {visibleProducts < getFilteredProducts().length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMoreProducts}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold"
              >
                🔄 Load More
              </button>
            </div>
          )}
        </div>
      )}

      {/* Full-Page Product Details Modal */}
      {selectedProduct &&
        ReactDOM.createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50"
            >
              <motion.div className="bg-gray-900 text-white p-8 rounded-lg max-w-lg w-full">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
                <img
                  src={selectedProduct.productImage}
                  alt={selectedProduct.productName}
                  className="w-full h-64 object-cover rounded-md"
                />
                <h2 className="text-2xl font-bold mt-4">
                  {selectedProduct.productName}
                </h2>
                {selectedProduct.sellerId?.shopName && (
                  <h3 className="text-lg font-bold text-white mt-2 truncate">
                    {selectedProduct.sellerId.shopName}
                  </h3>
                )}
                {selectedProduct.sellerId?.hostelName && (
                  <h3 className="text-lg font-bold text-white mt-2 truncate">
                    {selectedProduct.sellerId.hostelName}
                  </h3>
                )}
                {selectedProduct.sellerId?.shopAddress && (
                  <h3 className="text-lg font-bold text-white mt-2 truncate">
                    {selectedProduct.sellerId.shopAddress}
                  </h3>
                )}
                {selectedProduct.sellerId?.roomNumber && (
                  <h3 className="text-lg font-bold text-white mt-2 truncate">
                    {selectedProduct.sellerId.roomNumber}
                  </h3>
                )}
                <p className="text-gray-400 mt-2">
                  {selectedProduct.description}
                </p>
                <p className="text-green-400 text-lg font-bold mt-4">
                  ${selectedProduct.price}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
