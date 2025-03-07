import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
export default function EditUserProfile() {
    const location = useLocation();
    const navigate=useNavigate();
    //console.log(location.state?.user?.role);
  const [user, setUser] = useState({
    username:location.state?.user?.username||'',
    email:location.state?.user?.email||'',
    role: location.state?.user?.role||'', // Default role
    shopName: location.state?.user?.shopName||'',
    shopAddress:location.state?.user?.shopAddress||'',
    hostelName:location.state?.user?.hostelName||'',
    roomNumber: location.state?.user?.roomNumber||'',
    contactNumber:location.state?.user?.contactNumber||'',
    profilePicture:location.state?.user?.profilePicture||'',
  });
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
    
  };
  

  const handleSave = async () => {
    setUser(editedUser);
    
    try {
        const response = await fetch('http://localhost:3000/api/v1/users/updateMe', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedUser),
          credentials: "include",
        });
       
        if (response.ok) {
          navigate('/me');
        } else {
          console.error('Failed to save profile');
        }
      } catch (error) {
        console.log('Error:', error.message);
      }
   
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("profileImage", file);
  
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/upload-profile-photo", {
        method: "POST",
        body: formData,
        credentials: "include", // For cookies/sessions
      });
  
      if (!response.ok) {
        throw new Error("Upload failed!");
      }
  
      const data = await response.json();
      console.log("Upload Success:", data);
      alert("Profile picture uploaded successfully!");
  
      setEditedUser((prev) => ({
        ...prev,
        profilePicture: data.imageUrl, // Update profile picture state
      }));
    } catch (error) {
      console.error("Upload error:", error.message);
      alert("Error uploading profile picture.");
    }
  };
  
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 shadow-xl rounded-2xl w-300 h-screen">
      {/* Profile Picture */}
      <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500">
        <img
          src={editedUser.profilePicture}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <input type="file" accept="image/*" onChange={handleUpload} className="mt-2" />
     
      {/* Name & Bio */}
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
       <input
        type="text"
        name="role"
        value={editedUser.role}
        onChange={handleChange}
        className="mt-4 text-2xl font-bold text-center border rounded p-1"
      />
      {editedUser.role==='student' &&
      <input
        type="text"
        name="hostelName"
        value={editedUser.hostelName}
        onChange={handleChange}
        className="mt-4 text-2xl font-bold text-center border rounded p-1"
      /> }
      {editedUser.role=='student' &&
      <input
        type="text"
        name="roomNumber"
        value={editedUser.roomNumber}
        onChange={handleChange}
        className="mt-4 text-2xl font-bold text-center border rounded p-1"
      />}
      {editedUser.role==='shopkeeper' &&
      <input
        type="text"
        name="shopName"
        value={editedUser.shopName}
        onChange={handleChange}
        className="mt-4 text-2xl font-bold text-center border rounded p-1"
      /> }
      {editedUser.role=='shopkeeper' &&
      <input
        type="text"
        name="shopAddress"
        value={editedUser.shopAddress}
        onChange={handleChange}
        className="mt-4 text-2xl font-bold text-center border rounded p-1"
      />}
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
