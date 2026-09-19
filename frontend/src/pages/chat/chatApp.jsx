import React, { useState } from "react";
import "../../App.css";
import Chatlist from "./chatBar";
import ChatBox from "./chatBox";
import pic from "./ghibli.png";
import { useData } from "../../store/userDataStore";

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const { user, loading } = useData();

  if (!user) return <p className="text-center text-red-500">Error loading user data</p>;

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackToChatList = () => {
    setSelectedChat(null);
  };

  return (
    <div className=" flex h-screen main overflow-hidden p-3 pb-15">
      {/* Show chat list only when no chat is selected on small screens */}
      <div
        className={`${
          selectedChat ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-1/3 text-white border-r border-gray-700`}
      >
        <div className="p-4 chat-list-header flex items-center justify-between">
          <h1 className="text-white font-bold text-lg md:text-2xl pt-1 pb-1">Chats</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Chatlist onSelectChat={handleSelectChat} />
        </div>
      </div>

      {/* Show chat box only when a chat is selected */}
      <div
        className={`${
          selectedChat ? "flex" : "hidden"
        } flex-col w-full md:flex md:w-2/3 chat-box-main`}
      >
        <div className="md:hidden p-3">
          {/* Back Button only on mobile */}
          <button
            onClick={handleBackToChatList}
            className="text-blue-500 hover:underline"
          >
            ← Back to chats
          </button>
        </div>
        {selectedChat ? (
          <ChatBox chatUser={selectedChat} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-blue-800">
            <img src={pic} alt="" className="w-full h-full" />
            <p className="mb-15 text-xl">Select a chat to start messaging...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
