import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import LoadingPage from "../../components/Loading";

export default function AllSells() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/products/sells",
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.status === "success") {
          setProducts(data.data.products);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  const handleMessageClick = (studentId) => {
    if (studentId) {
      navigate(`/chat`, { state: { studentId } });
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold text-center text-cyan-400 mb-8 tracking-wider">
        🛒 All Sells
      </h1>

      {/* Loading Page */}
      {loading ? (
        <LoadingPage />
      ) : (
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
              <h2 className="text-xl font-bold text-cyan-300">
                {product.productName}
              </h2>
              <p className="text-gray-300 font-semibold mt-1">
                👤 Seller: {product.sellerId?.username}
              </p>

              {/* Buttons */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleViewDetails(product)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleMessageClick(product.sellerId)}
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <MessageCircle size={24} />
                  <span className="sr-only text-blue-500">Message</span>
                  
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleProducts < products.length && !loading && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMoreProducts}
            className="px-6 py-3 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Load More 🔄
          </button>
        </div>
      )}

      {/* Product Details Popup */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white  rounded-lg shadow-lg max-w-lg w-full">
            <img
              src={selectedProduct.productImage}
              alt={selectedProduct.productName}
              className="w-full h-90 object-cover rounded-lg "
            />
            <h2 className="text-2xl font-bold text-cyan-300">
              {selectedProduct.productName}
            </h2>
            <p className="mt-2 text-gray-300">
              🛍️ Items Available: {selectedProduct.noOfItems}
            </p>
            <p className="text-gray-300 font-semibold mt-1">
              👤 Seller: {selectedProduct.sellerId?.username}
            </p>
            <div className="mt-3 bg-gray-800 p-3 rounded-lg text-sm text-gray-300">
              <p>📞 Contact: {selectedProduct.sellerId?.contactNumber}</p>
              <p>🏢 Hostel: {selectedProduct.sellerId?.hostelName}</p>
              <p>🚪 Room: {selectedProduct.sellerId?.roomNumber}</p>
            </div>
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
