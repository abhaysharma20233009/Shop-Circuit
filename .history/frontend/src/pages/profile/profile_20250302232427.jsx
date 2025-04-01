import { useState } from "react";

export default function UserProfile() {
  const [user] = useState({
    name: "Abhay Sharma",
    bio: "Full Stack Developer | Passionate about building scalable web apps",
    profilePic: "/cop.jpg", // Default profile picture
    skills: ["React", "Node.js", "MongoDB", "Socket.IO", "Tailwind CSS"],
  });

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl w-full h-screen">
      {/* Profile Picture */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500">
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name & Bio */}
      <h2 className="mt-4 text-3xl font-bold">{user.name}</h2>
      <p className="text-gray-600 text-center text-xl">{user.bio}</p>

      {/* Skills */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-700">Skills:</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Edit Button */}
      <button className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
        ✏️ Edit Profile
      </button>
    </div>
  );
}
