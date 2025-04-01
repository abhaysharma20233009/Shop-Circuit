import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/users/me", {
          credentials: "include", // Include cookies for authentication
        });
        const data = await response.json();
        if (data.status) {
          setUser(data.data.data);
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

  if (loading) return <p className="text-center">Loading...</p>;
  if (!user) return <p className="text-center text-red-500">Error loading user data</p>;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 shadow-lg rounded-2xl max-w-xl w-full mx-auto">
      {/* Profile Picture */}
      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
        <img
          src={user.profilePic || "/cop.jpg"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name & Contact Info */}
      <h2 className="mt-4 text-3xl font-bold text-gray-800">{user.username}</h2>



      
      <p className="text-gray-600 text-sm">{user.email}</p>
      <p className="text-gray-700 font-semibold">📞 {user.contactNumber || "N/A"}</p>

      {/* Additional Info for Shopkeeper or Student */}
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

      {/* Edit Button */}
      <button
        className="mt-5 bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
        onClick={() => navigate("/editProfile")}
      >
        ✏️ Edit Profile
      </button>
    </div>
  );
}
