import { useEffect, useState } from "react";

const RentRequestsCard = () => {
  const [rentRequests, setRentRequests] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // Initially show 3 items

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/rent/", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.status) {
          setRentRequests(data.data);
        } else {
          console.error("Error fetching rent requests:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRequestData();
  }, []);

  // Handle Mark Fulfilled
  const handleMarkFulfilled = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/rent/${requestId}`, // Fixed URL
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
      setRentRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );
    } catch (error) {
      console.error("Error marking request as fulfilled:", error);
    }
  };

  return (
    <div className="p-6 w-full border border-gray-700 shadow-lg rounded-xl">
      <h2 className="text-2xl font-extrabold text-center text-blue-400 mb-10 tracking-wide neon-text">
        🚀 Rent Requests 🚀
      </h2>

      {/* Grid Layout */}
      <div className="w-full p-4 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {rentRequests.length > 0 ? (
            rentRequests.slice(0, visibleCount).map((request) => (
              <div
                key={request._id}
                className="relative group bg-white/10 backdrop-blur-lg border border-gray-700 shadow-lg rounded-xl p-6 transition-transform hover:scale-105 hover:border-blue-500 hover:shadow-blue-500/50"
              >
                {/* Item Name */}
                <h3 className="text-2xl font-bold text-blue-300">{request.itemName}</h3>

                {/* Status */}
                <p
                  className={`text-sm font-semibold mt-2 ${
                    request.status === "pending"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  ⚡ Status: {request.status}
                </p>

                {/* Request Details */}
                <p className="text-gray-400">🛒 Items Required: {request.numberOfItems}</p>
                <p className="text-gray-300">🕒 Duration: {request.duration}</p>
                <p className="text-gray-400">📜 Description: {request.description}</p>

                {/* Action Button */}
                {request.status === "pending" && (
                  <button
                    onClick={() => handleMarkFulfilled(request._id)}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 hover:shadow-green-400/50"
                  >
                    ✅ Mark Fulfilled
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-lg">
              🚫 No pending rent requests found.
            </p>
          )}
        </div>
      </div>

      {/* Show More / Show Less Buttons */}
      {rentRequests.length > 3 && (
        <div className="flex justify-center mt-6">
          {visibleCount < rentRequests.length && (
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

export default RentRequestsCard;
