import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { MessageCircle } from "lucide-react";

export default function AllRequests() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const navigate = useNavigate(); // ✅ Initialize navigate

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
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  // ✅ Function to navigate to chat
  const handleMessageClick = (studentId) => {
    if (studentId) {
      navigate(`/chat`, { state: { studentId } }); // Redirects to chat
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold text-center text-purple-400 mb-10 tracking-wide">
        🚀 All Requests 🚀
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products.slice(0, visibleProducts).map((product) => (
          <div
            key={product._id}
            className="relative group bg-white/10 backdrop-blur-lg border border-gray-700 shadow-lg rounded-xl p-5 transition-transform hover:scale-105 hover:border-purple-500"
          >

            {/* Request Details */}
            <h2 className="text-xl font-bold text-purple-300">{product.itemName}</h2>
            <p className="text-gray-400">🔹 Renter: {product.studentId?.username}</p>
            <p className="text-gray-300">🛒 Items Required: {product.numberOfItems}</p>
            <p className="text-yellow-400 font-semibold">⚡ Status: {product.status}</p>
            <p className="text-gray-400">📜 Description: {product.description}</p>

            {/* Renter Details */}


            {product.studentId && (
              <div className="mt-3 bg-gray-900/50 p-3 rounded-lg text-sm text-gray-300">
                <p>📞 Contact: {product.studentId.contactNumber}</p>
                <p>🏠 Hostel: {product.studentId.hostelName}</p>
                <p>🚪 Room: {product.studentId.roomNumber}</p>
              </div>
            )}

            {/* ✅ Message Button */}
            <button
              onClick={() => handleMessageClick(product.studentId)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full flex items-center justify-center gap-2 hover: cursor-pointer"
            >
              <MessageCircle size={18} />
              Message
            </button>
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
    </div>
  );
}
