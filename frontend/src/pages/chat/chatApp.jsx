import React, { useState } from "react";
import "../../App.css";
import Chatlist from "./chatBar";
import ChatBox from "./chatBox";
import pic from "./startAchat.png";
import { useData } from "../../store/userDataStore";// Adjust the import path as necessary 
const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(null);
    const { user, loading } = useData();
    if (!user) return <p className="text-center text-red-500">Error loading user data</p>;
    console.log(user+"user");
  // Function to select a user chat from Chatlist
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="flex h-screen main overflow-hidden p-10">
      {/* Sidebar - Chat List */}

      <div className="w-34/100 text-white flex flex-col border-r border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 chat-list-header flex items-center justify-between">
          <h1 className="text-white font-bold text-lg md:text-2xl  pt-1 pb-1">Chats</h1>
            {/* Profile Picture */}
                 <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden  shadow-lg">
                      <img
                        src={user.profilePicture || "/cop.jpg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
          <strong>You : {user.username}</strong>        
          <button className="text-gray-300 hover:text-white transition">
            <i className="fas fa-cog"></i> {/* Settings Icon */}
          </button>
        </div>
        
        {/* Chat List */}
        <div className="flex-1">
          <Chatlist onSelectChat={handleSelectChat} />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 chat-box-main flex flex-col">
        {selectedChat ? (
          <ChatBox chatUser={selectedChat} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <img
              src={pic}
              alt=""
              className="w-48 h-48 rounded-full opacity-50"
            />
            <p className="mt-4 text-lg">Select a chat to start messaging...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
