import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
export default function AllSells() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/products/sells",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          setProducts(data.data.products);
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
  const handleMessageClick = (studentId) => {
    if (studentId) {
      navigate(`/chat`, { state: { studentId } }); // Redirects to chat
    }
  };
  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold text-center text-cyan-400 mb-8 tracking-wider">
        🛒 All Sells
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products.slice(0, visibleProducts).map((product) => (
          <div
            key={product._id}
            className="relative group bg-white/10 backdrop-blur-lg border border-gray-700 shadow-lg rounded-xl p-4 transition-transform hover:scale-105"
          >

            {/* Image */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>

            {/* Product Info */}
            <h2 className="mt-4 text-xl font-bold text-cyan-300">{product.productName}</h2>
            <p className="text-gray-400">🛍️ Items Available: {product.noOfItems}</p>
            <p className="text-gray-300 font-semibold mt-1">👤 Seller: {product.sellerId?.username}</p>

            {/* Seller Details */}

            {product.sellerId && (
              <div className="mt-3 bg-gray-900/50 p-3 rounded-lg text-sm text-gray-300">
                <p>📞 Contact: {product.sellerId.contactNumber}</p>
                <p>🏢 Hostel: {product.sellerId.hostelName}</p>
                <p>🚪 Room: {product.sellerId.roomNumber}</p>
              </div>
            )}
            {/* ✅ Message Button */}
            <button
              onClick={() => handleMessageClick(product.sellerId)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full flex items-center justify-center gap-2 hover: cursor-pointer"
            >
              <MessageCircle size={18} />
              Message
            </button>
          </div>
        ))}
      </div>

      {visibleProducts < products.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMoreProducts}
            className="px-6 py-3 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Load More 🔄
          </button>
        </div>
      )}
    </div>
  );
}
