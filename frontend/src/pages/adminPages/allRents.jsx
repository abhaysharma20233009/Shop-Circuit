import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "../../components/Loading";
import RentRequestForm from "../../components/rentRequestForm";
import { FaSearch } from "react-icons/fa";

import axios from "axios";

export default function AllRequests() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [ModifiedProducts, setModifiedProduct] = useState(products);
  const [loading, setLoading] = useState(true);
  const [isRentRequestModalOpen, setIsRentRequestModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Function to filter products (only based on search query)
    const getFilteredProducts = () => {
      if (searchQuery.trim() === "") {
        return products; // Return all products if no search query
      }
      return products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/rent/rent", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.status === "success") {
          setProducts(data.data);
        } else {
          toast.error("Failed to fetch requests ❌");
        }
      } catch (error) {
        toast.error("Error fetching data ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      const res = await axios({
        url: `http://localhost:3000/api/v1/admin/rent/${id}`,
        method: "DELETE",
        withCredentials: true,
      });

      setModifiedProduct(
        ModifiedProducts.filter((product) => product._id !== id)
      );
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product!");
    }
  };

  // ✅ Navigate to chat page
  const handleMessageClick = (studentId) => {
    if (studentId) {
      navigate(`/chat`, { state: { studentId } });
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 p-3 rounded-lg shadow-lg">
        <h1 className="text-white text-xl font-bold mb-3 md:mb-0">
          🔍 Search Rents
        </h1>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for rents..."
            className="w-full p-2 pl-10 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all">
            <FaSearch />
          </button>
        </div>
      </div>
      {/* Header with Button on the Right */}
      <div className="my-10">
        <h1 className="text-4xl text-center font-extrabold text-purple-400 tracking-wide">
          All Rent Requests
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products.slice(0, visibleProducts).map((product) => (
          <div
            key={product._id}
            className="relative group bg-white/10  border border-gray-700 shadow-lg rounded-xl p-5 transition-transform hover:scale-105 hover:border-purple-500"
          >
            <button
              onClick={() => handleDelete(product._id)}
              className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-400 transition transform hover:scale-105 shadow-md hover:shadow-gray-500/50"
            >
              Delete
            </button>

            {/* Request Details */}
            <h2 className="text-xl font-bold text-purple-300">
              {product.itemName}
            </h2>
            <p className="text-gray-400">
              🔹 Renter: {product.studentId?.username}
            </p>
            <p className="text-gray-300">
              🛒 Items Required: {product.numberOfItems}
            </p>
            <p className="text-yellow-400 font-semibold">
              ⚡ Status: {product.status}
            </p>
            <p className="text-gray-400">
              📜 Description: {product.description}
            </p>

            {/* Renter Details */}
            {product.studentId && (
              <div className="mt-3 bg-gray-900/50 p-3 rounded-lg text-sm text-gray-300">
                <p>📞 Contact: {product.studentId.contactNumber}</p>
                <p>🏠 Hostel: {product.studentId.hostelName}</p>
                <p>🚪 Room: {product.studentId.roomNumber}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleProducts < products.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMoreProducts}
            className="px-6 py-3 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            🔄 Load More
          </button>
        </div>
      )}

      {/* Rent Request Modal */}
      <RentRequestForm
        isOpen={isRentRequestModalOpen}
        onClose={() => setIsRentRequestModalOpen(false)}
      />
    </div>
  );
}
