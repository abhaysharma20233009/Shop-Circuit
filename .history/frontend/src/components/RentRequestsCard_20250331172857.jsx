import { useEffect, useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash, FaCheck } from "react-icons/fa";

const RentRequestsCard = () => {
  const [rentRequests, setRentRequests] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [editingRent, setEditingRent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);

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
    setDropdownOpen(null);
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
      <h2 className="text-2xl font-extrabold text-center text-blue-400 mb-10">🚀 Rent Requests 🚀</h2>
      {loading && <p className="text-center text-blue-300">Loading rent requests...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      <div className="w-full p-4 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {rentRequests.slice(0, visibleCount).map((request) => (
            <div key={request._id} className="relative bg-white/10 border border-gray-700 shadow-lg rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-blue-300">{request.itemName}</h3>
                <div className="relative">
                  <button onClick={() => setDropdownOpen(dropdownOpen === request._id ? null : request._id)}
                    className="text-gray-400 hover:text-white">
                    <FaEllipsisV />
                  </button>
                  {dropdownOpen === request._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                      <button onClick={() => handleMarkFulfilled(request._id)} className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700">✅ Mark Fulfilled</button>
                      <button onClick={() => handleUpdateClick(request)} className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700">✏ Update</button>
                      <button onClick={() => handleDeleteRentRequest(request._id)} className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700">🗑 Delete</button>
                    </div>
                  )}
                </div>
              </div>
              <p className={`text-sm mt-2 ${request.status === "pending" ? "text-yellow-400" : "text-green-400"}`}>⚡ Status: {request.status}</p>
              <p className="text-gray-400">🛒 Items Required: {request.numberOfItems}</p>
              <p className="text-gray-300">🕒 Duration: {request.duration}</p>
              <p className="text-gray-400">📜 Description: {request.description}</p>
            </div>
          ))}
        </div>
      </div>

      {editingRent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Rent Request</h2>
            <input type="text" value={editingRent.itemName} onChange={(e) => setEditingRent({ ...editingRent, itemName: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <input type="number" value={editingRent.numberOfItems} onChange={(e) => setEditingRent({ ...editingRent, numberOfItems: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <input type="text" value={editingRent.duration} onChange={(e) => setEditingRent({ ...editingRent, duration: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <input type="text" value={editingRent.description} onChange={(e) => setEditingRent({ ...editingRent, description: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <button onClick={() => setEditingRent(null)} className="w-full mt-2 bg-gray-500 text-white p-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentRequestsCard;
