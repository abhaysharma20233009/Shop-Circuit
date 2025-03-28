import { useEffect, useState } from "react";

const SellRequestsCard = () => {
  const [sells, setSells] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // Initially show 3 items

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/products/userSells",
          {
            credentials: "include", // Include cookies for authentication
          }
        );
        const data = await response.json();
        if (data.status) {
          setSells(data.data);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRequestData();
  }, []);

  // Handle Mark Sold
  const handleMarkFulfilled = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/products/markSold/${requestId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark request as fulfilled");
      }

      // Remove fulfilled request from UI
      setSells((prevSells) => prevSells.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error marking request as fulfilled:", error);
    }
  };

  return (
    <div className="p-4 w-full border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center justify-center">
        🚀 Sell Requests 🚀
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sells.length > 0 ? (
          sells.slice(0, visibleCount).map((sell) => (
            <div
              key={sell._id}
              className="p-6 bg-white/10 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
          
              <img
                src={sell.productImage}
                alt={sell.productName}
                className="w-full h-40 object-cover rounded-lg border border-cyan-500 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-cyan-300">
                {sell.productName}
              </h3>
              <p className="text-gray-400 mt-2">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    sell.status === "pending"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {sell.status}
                </span>
              </p>
              <p className="text-gray-300">📦 Items: {sell.noOfItems}</p>
              <p className="text-gray-300">📝 {sell.description}</p>

              {sell.status === "pending" && (
                <button
                  onClick={() => handleMarkFulfilled(sell._id)}
                  className="mt-2 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition-all duration-300"
                >
                  ✅ Mark Sold
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-lg">
            No sell requests found.
          </p>
        )}
      </div>

      {/* Show More / Show Less Buttons */}
      {sells.length > 3 && (
        <div className="flex justify-center mt-6">
          {visibleCount < sells.length && (
            <button
              onClick={() => setVisibleCount(visibleCount + 3)}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
            >
              🔽 Show More
            </button>
          )}

          {visibleCount > 3 && (
            <button
              onClick={() => setVisibleCount(3)}
              className="ml-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition-all transform hover:scale-105"
            >
              🔼 Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SellRequestsCard;
