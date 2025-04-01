import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../store/userDataStore";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentData, setRentData] = useState({ amount: "", duration: "" });

  if (loading) return <p className="text-center">Loading...</p>;
  if (!user) return <p className="text-center text-red-500">Error loading user data</p>;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setRentData({ ...rentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rent Request Submitted:", rentData);
    closeModal();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 shadow-lg rounded-2xl max-w-xl w-full mx-auto">
      {/* Profile Picture */}
      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
        <img
          src={user.profilePicture || "/cop.jpg"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name & Contact Info */}
      <h2 className="mt-4 text-3xl font-bold text-gray-800">{user.username}</h2>
      <p className="mt-2 text-gray-600 text-sm">{user.email}</p>
      <p className="mt-2 text-gray-700 font-semibold">📞 {user.contactNumber || "N/A"}</p>

      {/* Additional Info */}
      {user.role === "shopkeeper" && (
        <div className="mt-4 text-center w-full">
          <h3 className="text-lg font-semibold text-gray-700">Shop Details:</h3>
          <p className="text-gray-600">🏪 {user.shopName || "N/A"}</p>
          <p className="text-gray-600">📍 {user.shopAddress || "N/A"}</p>
        </div>
      )}

      {user.role === "student" && (
        <div className="mt-4 text-center w-full">
          <h3 className="text-lg font-semibold text-gray-700">Hostel Details:</h3>
          <p className="text-gray-600">🏢 {user.hostelName || "N/A"}</p>
          <p className="text-gray-600">🚪 Room No: {user.roomNumber || "N/A"}</p>
        </div>
      )}

      {/* Request Rent Button */}
      <button
        className="mt-5 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition w-40"
        onClick={openModal}
      >
        Request Rent
      </button>

      {/* Edit Button */}
      <button
        className="mt-5 bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
        onClick={() => navigate("/editProfile", { state: { user } })}
      >
        ✏️ Edit Profile
      </button>

      {/* Rent Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">Rent Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={rentData.amount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (months)</label>
                <input
                  type="number"
                  name="duration"
                  value={rentData.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
