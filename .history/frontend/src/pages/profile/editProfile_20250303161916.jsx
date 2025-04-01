import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditUserProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: location.state?.user?.username || "",
    email: location.state?.user?.email || "",
    role: location.state?.user?.role || "", // Default role
    shopName: location.state?.user?.shopName || "",
    shopAddress: location.state?.user?.shopAddress || "",
    hostelName: location.state?.user?.hostelName || "",
    roomNumber: location.state?.user?.roomNumber || "",
    contactNumber: location.state?.user?.contactNumber || "",
    profilePicture: location.state?.user?.profilePicture || "",
  });

  const [editedUser, setEditedUser] = useState(user);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user.profilePicture); // Image preview

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  // Handle file input change (image upload)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // Show preview before upload
    }
  };

  // Handle save profile
  const handleSave = async () => {
    const formData = new FormData();

    // Append form fields
    Object.keys(editedUser).forEach((key) => {
      formData.append(key, editedUser[key]);
    });

    // Append the image file if selected
    if (imageFile) {
      formData.append("profilePicture", imageFile);
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/updateMe", {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        navigate("/me");
      } else {
        console.error("Failed to save profile");
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 shadow-xl rounded-2xl w-300 h-screen">
      {/* Profile Picture */}
      <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500">
        <img src={preview} alt="Profile" className="w-full h-full object-cover" />
      </div>

      {/* Upload Profile Picture */}
      <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />

      {/* Name & Contact */}
      <input
        type="text"
        name="username"
        value={editedUser.username}
        onChange={handleChange}
        className="mt-4 text-2xl font-bold text-center border rounded p-1"
      />
      <input
        type="text"
        name="contactNumber"
        value={editedUser.contactNumber}
        onChange={handleChange}
        className="mt-4 text-2xl font-bold text-center border rounded p-1"
      />

      {/* Role-based Fields */}
      {editedUser.role === "student" && (
        <>
          <input
            type="text"
            name="hostelName"
            value={editedUser.hostelName}
            onChange={handleChange}
            className="mt-4 text-2xl font-bold text-center border rounded p-1"
          />
          <input
            type="text"
            name="roomNumber"
            value={editedUser.roomNumber}
            onChange={handleChange}
            className="mt-4 text-2xl font-bold text-center border rounded p-1"
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
            className="mt-4 text-2xl font-bold text-center border rounded p-1"
          />
          <input
            type="text"
            name="shopAddress"
            value={editedUser.shopAddress}
            onChange={handleChange}
            className="mt-4 text-2xl font-bold text-center border rounded p-1"
          />
        </>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        💾 Save Profile
      </button>
    </div>
  );
}
