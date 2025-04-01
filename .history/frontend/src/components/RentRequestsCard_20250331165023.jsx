import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const RentRequestsCard = () => {
  const [rentRequests, setRentRequests] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [editingRent, setEditingRent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequestData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/v1/rent/", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.status) {
          setRentRequests(data.data);
        } else {
          setError("Error fetching rent requests.");
        }
      } catch (err) {
        setError("Failed to fetch rent requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, []);

  // Handle Mark Fulfilled
  const handleMarkFulfilled = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/rent/${requestId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to mark as fulfilled");

      setRentRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateClick = (rent) => {
    setEditingRent({ ...rent });
  };

  const handleUpdate = async () => {
    if (!editingRent) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/rent/${editingRent._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRent),
      });

      if (!response.ok) throw new Error("Failed to update rent request");

      setRentRequests((prevRequests) =>
        prevRequests.map((req) => (req._id === editingRent._id ? { ...req, ...editingRent } : req))
      );
      setEditingRent(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteRentRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/rent/${requestId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete rent request");

      setRentRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-6 w-full border border-gray-700 shadow-lg rounded-xl">
      <h2 className="text-2xl font-extrabold text-center text-blue-400 mb-10 tracking-wide neon-text">
        🚀 Rent Requests 🚀
      </h2>

      {loading && <p className="text-center text-blue-300">Loading rent requests...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Grid Layout */}
      <div className="w-full p-4 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {rentRequests.length > 0 ? (
            rentRequests.slice(0, visibleCount).map((request) => (
              <div
                key={request._id}
                className="relative group bg-white/10 backdrop-blur-lg border border-gray-700 shadow-lg rounded-xl p-6 transition-transform hover:scale-105 hover:border-blue-500 hover:shadow-blue-500/50"
              >
                <h3 className="text-2xl font-bold text-blue-300">{request.itemName}</h3>
                <p className={`text-sm font-semibold mt-2 ${request.status === "pending" ? "text-yellow-400" : "text-green-400"}`}>
                  ⚡ Status: {request.status}
                </p>
                <p className="text-gray-400">🛒 Items Required: {request.numberOfItems}</p>
                <p className="text-gray-300">🕒 Duration: {request.duration}</p>
                <p className="text-gray-400">📜 Description: {request.description}</p>

                {/* Action Buttons */}
                {request.status === "pending" && (
                  <div>
                    <button
                      onClick={() => handleMarkFulfilled(request._id)}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 hover:shadow-green-400/50"
                    >
                      ✅ Mark Fulfilled
                    </button>
                    <button
                      onClick={() => handleUpdateClick(request)}
                      className="mt-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <FaEdit />
                      Update
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleDeleteRentRequest(request._id)}
                  className="mt-2 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-lg">🚫 No pending rent requests found.</p>
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

      {/* Update Modal */}
      {editingRent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Rent Request</h2>
            <input type="text" value={editingRent.itemName} onChange={(e) => setEditingRent({ ...editingRent, itemName: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <input type="number" value={editingRent.numberOfItems} onChange={(e) => setEditingRent({ ...editingRent, numberOfItems: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <input type="text" value={editingRent.duration} onChange={(e) => setEditingRent({ ...editingRent, duration: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <input type="text" value={editingRent.description} onChange={(e) => setEditingRent({ ...editingRent, description: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <button onClick={handleUpdate} className="w-full bg-blue-500 text-white p-2 rounded">Save Changes</button>
            
            <button onClick={() => setEditingRent(null)} className="w-full mt-2 bg-gray-500 text-white p-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentRequestsCard;
