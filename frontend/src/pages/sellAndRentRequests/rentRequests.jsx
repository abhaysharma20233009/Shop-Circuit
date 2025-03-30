import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageCircle } from "lucide-react";
import LoadingPage from "../../components/Loading";
import RentRequestForm from "../../components/RentRequestForm";
import { FaMoneyBillWave } from "react-icons/fa";

export default function AllRequests() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [loading, setLoading] = useState(true);
  const [isRentRequestModalOpen, setIsRentRequestModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
      {/* Header with Button on the Right */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-extrabold text-purple-400 tracking-wide">
          🚀 All Rent Requests 🚀
        </h1>
        <button
          className="flex items-center justify-center bg-purple-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-purple-600 transition shadow-md"
          onClick={() => setIsRentRequestModalOpen(true)}
        >
          <FaMoneyBillWave className="mr-2" /> Request Rent
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products.slice(0, visibleProducts).map((product) => (
          <div
            key={product._id}
            className="relative group bg-white/10  border border-gray-700 shadow-lg rounded-xl p-5 transition-transform hover:scale-105 hover:border-purple-500"
          >
            {/* Message Icon (Top Right) */}
            {product.studentId && (
              <button
                onClick={() => handleMessageClick(product.studentId)}
                className="absolute top-3 right-3  text-blue-400 hover:text-blue-500 transition-all"
              >
                <MessageCircle size={22} />
                {/* Tooltip */}
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Message
                </span>
              </button>
            )}

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
