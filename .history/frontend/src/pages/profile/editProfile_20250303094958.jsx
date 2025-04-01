import { useState } from "react";

export default function EditUserProfile() {
  const [user, setUser] = useState({
    name: "Abhay Sharma",
    bio: "Full Stack Developer | Passionate about building scalable web apps",
    profilePic: "/cop.jpg", // Default profile picture
    skills: ["React", "Node.js", "MongoDB", "Socket.IO", "Tailwind CSS"],
  });

  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSkillChange = (e) => {
    setEditedUser({ ...editedUser, skills: e.target.value.split(",") });
  };

  const handleSave = () => {
    setUser(editedUser);
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-600 shadow-xl rounded-2xl w-300 h-screen">
      {/* Profile Picture */}
      <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500">
        <img
          src={editedUser.profilePic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <input
        type="text"
        name="profilePic"
        value={editedUser.profilePic}
        onChange={handleChange}
        className="mt-2 border rounded p-1 text-center"
        placeholder="Profile Picture URL"
      />

      {/* Name & Bio */}
      <input
        type="text"
        name="name"
        value={editedUser.name}
        onChange={handleChange}
        className="mt-4 text-2xl font-bold text-center border rounded p-1"
      />
      <textarea
        name="bio"
        value={editedUser.bio}
        onChange={handleChange}
        className="mt-2 text-gray-600 text-center border rounded p-2 w-full"
      />

      {/* Skills */}
      <div className="mt-4 w-full">
        <h3 className="text-xl font-semibold text-gray-700">Skills:</h3>
        <input
          type="text"
          value={editedUser.skills.join(",")}
          onChange={handleSkillChange}
          className="mt-2 border rounded p-1 w-full"
          placeholder="Comma-separated skills"
        />
      </div>

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
