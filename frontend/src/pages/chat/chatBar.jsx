import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown } from "lucide-react";
import pic from "./defaultImg_shopCircuit.webp";
import { useLocation } from "react-router-dom";

const Chatlist = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]); // Ensure chats is always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const variable = location.state?.userProfile;
  const [hoveredChat, setHoveredChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/users/allUsers",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        ); // API endpoint

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await response.json();

        // Check if the data has the expected structure (status, result, and result.data being an array)

        if (data.status === "success" && Array.isArray(data.data.response)) {
          setChats(data.data.response); // Set chats only if data is an array
          if (variable) setChats([variable]);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error.message); // Handle any errors
        console.log("Error fetching chats:", error);
      } finally {
        setLoading(false); // Set loading to false after the API call is complete
      }
    };

    fetchChats(); // Call the function to fetch data
  }, []); // Empty dependency array to run only once on component mount

  const [searchTerm, setSearchTerm] = useState("");

  // Filter chats based on search term
  const filteredChats = chats.filter((chat) =>
    chat.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white">Loading...</div>; // Show loading state
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error if there's any
  }

  return (
    <div className="border pt-3 chat-list-main h-screen w-full">
      {/* Header and Search Bar */}
      <div className="mb-2">
        <div className="chat-list-search-bar rounded-md w-full md:w-115 mx-4 px-4 py-2 flex items-center gap-5 transition">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white flex-1 outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="h-5/6 md:h-5/6 overflow-y-scroll overflow-x-hidden scroll-smooth">
        {filteredChats.map((chat) => (
          <div
            key={chat._id} // Ensure each item has a unique key
            className="group relative h-auto md:h-20 w-full flex items-center p-4 chat-list-single-chat border-b border-gray-500"
            onClick={() => onSelectChat(chat)}
            onMouseEnter={() => setHoveredChat(chat._id)}
            onMouseLeave={() => setHoveredChat(null)}
          >
            {/* Profile Picture */}
            <img
              src={chat.profilePicture || pic}
              alt="Profile"
              className="rounded-full h-10 w-10 md:h-12 md:w-12 mr-4 ml-1"
            />
            {/* Chat Details */}
            <div className="flex-1">
              <p className="text-white font-semibold text-sm md:text-base">
                {chat.username}
              </p>
            </div>

            {/* Options Icon */}
            {/* Arrow Icon (Shown on Hover) */}
            {/* {hoveredChat === chat._id && ( */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-transparent backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-50 delay-50">
                <ChevronDown className="text-gray-300 w-5 h-5" />
              </div>
            {/* // )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatlist;
