import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../store/userDataStore";
import RentRequestsCard from "../../components/RentRequestsCard";
import SellRequestCard from "../../components/SellRequestCard";
import RentRequestForm from "../../components/rentRequestForm";
import SellRequestForm from "../../components/sellRequestForm";

import { FaEdit, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import LoadingPage from "../../components/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, loading } = useData();
  const [isRentRequestModalOpen, setIsRentRequestModalOpen] = useState(false);
  const [isSellRequestModalOpen, setIsSellRequestModalOpen] = useState(false);

  if (loading) return <LoadingPage />;
  
  if (!user) {
    toast.error("Error loading user data ❌");
    return <p className="text-center text-red-500">Error loading user data</p>;
  }

  const handleOpenSellModal = () => {
    setIsSellRequestModalOpen(true);
    toast.success("Sell request form opened ✅");
  };

  const handleOpenRentModal = () => {
    setIsRentRequestModalOpen(true);
    toast.success("Rent request form opened ✅");
  };

  return (
    <div className="flex flex-wrap gap-8 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Profile Section */}
      <div className="w-full md:w-2/4 bg-white/10 backdrop-blur-md border border-gray-700 shadow-lg rounded-3xl p-6">
        <button
          onClick={() => navigate("/editProfile", { state: { user } })}
          className="absolute top-4 right-4 p-2 bg-cyan-500 text-black rounded-full hover:bg-cyan-600 transition"
        >
          <FaEdit size={20} />
        </button>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg">
            <img
              src={user.profilePicture || "/cop.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <h2 className="mt-4 text-3xl font-bold text-cyan-400 text-center">{user.username}</h2>
        <p className="text-center text-gray-300">{user.email}</p>
        <p className="text-center text-gray-400 mt-2 font-semibold">
          📞 {user.contactNumber || "N/A"}
        </p>

        {/* Role-Specific Details */}
        <div className="mt-6 bg-gray-900/50 p-4 rounded-lg text-sm text-gray-300 shadow-md">
          {user.role === "shopkeeper" ? (
            <>
              <h3 className="text-lg font-semibold text-cyan-400">🏪 Shop Details</h3>
              <p>📍 {user.shopName || "N/A"}</p>
              <p>📌 {user.shopAddress || "N/A"}</p>
            </>
          ) : user.role === "student" ? (
            <>
              <h3 className="text-lg font-semibold text-cyan-400">🏢 Hostel Details</h3>
              <p>🏠 {user.hostelName || "N/A"}</p>
              <p>🚪 Room No: {user.roomNumber || "N/A"}</p>
            </>
          ) : null}
        </div>

        {/* Buttons Section */}
        <div className="mt-6 flex justify-between w-full">
          <button
            className="flex items-center justify-center bg-purple-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-purple-600 transition w-1/2 mr-2 shadow-md"
            onClick={handleOpenSellModal}
          >
            <FaShoppingCart className="mr-2" /> Sell Product
          </button>
         {user.role==="student"&& <button
            className="flex items-center justify-center bg-red-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-red-600 transition w-1/2 ml-2 shadow-md"
            onClick={handleOpenRentModal}
          >
            <FaMoneyBillWave className="mr-2" /> Request Rent
          </button>}
        </div>
      </div>

      {/* Right Section: Rent and Sell Requests */}
      <div className="flex flex-col w-full">
        <div className="w-full mb-8">
          <RentRequestsCard />
        </div>
        <div className="w-full">
          <SellRequestCard />
        </div>
      </div>

      {/* Modals */}
      <RentRequestForm isOpen={isRentRequestModalOpen} onClose={() => setIsRentRequestModalOpen(false)} />
      <SellRequestForm isOpen={isSellRequestModalOpen} onClose={() => setIsSellRequestModalOpen(false)} />
    </div>
  );
}
