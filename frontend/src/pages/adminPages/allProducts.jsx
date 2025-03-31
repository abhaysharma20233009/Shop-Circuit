import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import LoadingPage from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductList() {
  const navigate = useNavigate();
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Manage loading state
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/admin/products",
          { withCredentials: true }
        );
        console.log(response.data.data + "chut");
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

  // Function to filter products (only based on search query)
  const getFilteredProducts = () => {
    if (searchQuery.trim() === "") {
      return products; // Return all products if no search query
    }
    return products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      const res = await axios({
        url: `http://localhost:3000/api/v1/admin/product/${id}`,
        method: "DELETE",
        withCredentials: true,
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
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

      {/* Product List */}
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
                  className="relative w-full max-w-xs h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group cursor-pointer bg-gray-900 bg-opacity-80 backdrop-blur-md border border-gray-700"
                >
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
                    <h3 className="font-bold text-lg truncate">
                      {product.productName}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 h-12 overflow-hidden line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-lg font-semibold text-green-400">
                        ${product.price}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowModal(true)}
                          className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition transform hover:scale-105 shadow-md hover:shadow-gray-500/50"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-400 transition transform hover:scale-105 shadow-md hover:shadow-gray-500/50"
                        >
                          Delete
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
                        <h2 className="text-lg font-bold">
                          {product.productName}
                        </h2>
                        <p className="text-gray-400 text-sm mt-2">
                          {product.description}
                        </p>

                        {/* Shop Info */}
                        <div className="mt-4">
                          <h3 className="text-blue-400 font-semibold">
                            Shop Details
                          </h3>
                          <p className="text-sm">
                            🏪 {product.sellerId.shopName}
                          </p>
                          <p className="text-sm">
                            Address: {product.sellerId.shopAddress}
                          </p>
                          <p className="text-sm">
                            📞 {product.sellerId.contactNumber}
                          </p>
                        </div>

                        {/* Price */}
                        <p className="text-lg font-semibold text-green-400 mt-4">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Load More Button */}
          {visibleProducts < getFilteredProducts().length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMoreProducts}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
              >
                🔄 Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
