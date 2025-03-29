import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown } from "lucide-react";
import { io } from "socket.io-client";
import pic from "./defaultImg_shopCircuit.webp";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  path: "/socket.io",
});

const Chatlist = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]); // Ensure chats is always an array
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const variable = location.state?.studentId;
  //  console.log("helohello" + variable.username);

  useEffect(() => {
    console.log("Emitting userList event...");
    socket.emit("userList");

    socket.on("updateChatList", (data) => {
      console.log("Received chat users:", data);

      if (data) {
        setChats(data); // Update chat list in real time
        if (variable) {
          console.log(variable.profilePicture + "picture");
          setChats([variable]); // Only update state once when component mounts
        }
      }
    });

    return () => {
      socket.off("updateChatList");
    };
  }, []);

  // Filter chats based on search term
  const filteredChats = chats.filter((chat) =>
    chat.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border pt-3 chat-list-main h-screen w-full">
      {/* Search Bar */}
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
        {filteredChats.length === 0 ? (
          <p className="text-white text-center">No chats available</p>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id}
              className="group relative h-auto md:h-20 w-full flex items-center p-4 chat-list-single-chat border-b border-gray-500 cursor-pointer"
              onClick={() => onSelectChat(chat)}
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
                <p className="text-gray-400 text-xs md:text-sm truncate">
                  {chat.lastMessage || ""}
                </p>
              </div>

              {/* Arrow Icon (Shown on Hover) */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-transparent backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-50 delay-50">
                <ChevronDown className="text-gray-300 w-5 h-5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chatlist;
