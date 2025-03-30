import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

export default function EditUserProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: location.state?.user?.username || "",
    email: location.state?.user?.email || "",
    role: location.state?.user?.role || "",
    shopName: location.state?.user?.shopName || "",
    shopAddress: location.state?.user?.shopAddress || "",
    hostelName: location.state?.user?.hostelName || "",
    roomNumber: location.state?.user?.roomNumber || "",
    contactNumber: location.state?.user?.contactNumber || "",
    profilePicture: location.state?.user?.profilePicture || "",
  });

  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.warn("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/v1/users/upload-profile-photo",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed!");
      }

      const data = await response.json();
      toast.success("Profile picture uploaded successfully!");

      setEditedUser((prev) => ({
        ...prev,
        profilePicture: data.imageUrl,
      }));
    } catch (error) {
      console.error("Upload error:", error.message);
      toast.error("Error uploading profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/updateMe",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedUser),
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setTimeout(() => navigate("/me"), 1000);
      } else {
        toast.error("Failed to save profile.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-black min-h-screen text-white">
      <div className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-md border border-gray-600 shadow-lg rounded-3xl relative">
        {/* Profile Picture Upload */}
        <div className="relative flex flex-col items-center">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg relative group">
            <img
              src={editedUser.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />

            {/* Plus Icon Overlay */}
            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
              <FaPlus className="text-white text-2xl" />
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold mt-4 text-cyan-400">
          Edit Profile
        </h2>

        {/* Input Fields */}
        <div className="mt-6 space-y-4">
          <input
            type="text"
            name="username"
            value={editedUser.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 text-lg border rounded-lg bg-black/20 border-cyan-500 text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-200"
          />
          <input
            type="text"
            name="contactNumber"
            value={editedUser.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full p-3 text-lg border rounded-lg bg-black/20 border-cyan-500 text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-200"
          />
          <input
            type="text"
            name="role"
            value={editedUser.role}
            onChange={handleChange}
            placeholder="Role"
            className="w-full p-3 text-lg border rounded-lg bg-black/20 border-cyan-500 text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-200"
          />

          {editedUser.role === "student" && (
            <>
              <input
                type="text"
                name="hostelName"
                value={editedUser.hostelName}
                onChange={handleChange}
                placeholder="Hostel Name"
                className="w-full p-3 text-lg border rounded-lg bg-black/20 border-cyan-500 text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-200"
              />
              <input
                type="text"
                name="roomNumber"
                value={editedUser.roomNumber}
                onChange={handleChange}
                placeholder="Room Number"
                className="w-full p-3 text-lg border rounded-lg bg-black/20 border-cyan-500 text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-200"
              />
            </>
          )}

          {editedUser.role === "shopkeeper" && (
            <>
              <input
                type="text"
                name="shopName"
                value={editedUser.shopName}
                onChange={handleChange}
                placeholder="Shop Name"
                className="w-full p-3 text-lg border rounded-lg bg-black/20 border-cyan-500 text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-200"
              />
              <input
                type="text"
                name="shopAddress"
                value={editedUser.shopAddress}
                onChange={handleChange}
                placeholder="Shop Address"
                className="w-full p-3 text-lg border rounded-lg bg-black/20 border-cyan-500 text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-200"
              />
            </>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 w-full py-3 text-lg bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-600 transition-shadow shadow-md hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "💾 Save Profile"}
        </button>
      </div>
    </div>
  );
}
