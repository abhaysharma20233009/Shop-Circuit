import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faPaperPlane,
  faEllipsisV,
  faTrash,
  faClock,
  faCheck,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import { ChevronDown } from "lucide-react";
import pic from "./defaultImg_shopCircuit.webp";
import loadingAnimation from "../../assets/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";

const socket = io("https://shop-circuit.onrender.com", {
  withCredentials: true,
  path: "/socket.io",
});

const ChatBox = ({ chatUser }) => {
  const formatLastSeen = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
      timeZoneName: "short",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const messagesContainerRef = useRef(null);
  const recipientId = chatUser._id;

  const addEmoji = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    const handleScroll = () => {
      if (!container) return;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50;
      setIsUserAtBottom(isAtBottom);
    };
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      socket.emit("markMessagesAsSeen", { recipientId });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [recipientId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptions !== null) {
        const menu = document.getElementById(`message-options-${showOptions}`);
        if (menu && !menu.contains(event.target)) {
          setShowOptions(null);
        }
      }
      if (showPicker) {
        const emojiPicker = document.getElementById("emoji-picker");
        const emojiButton = document.getElementById("emoji-button");
        if (
          emojiPicker &&
          !emojiPicker.contains(event.target) &&
          emojiButton &&
          !emojiButton.contains(event.target)
        ) {
          setShowPicker(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions, showPicker]);

  useEffect(() => {
    if (recipientId) {
      socket.emit("joinRoom", { recipientId });
    }

    socket.on("recipientLastSeen", (data) => setLastSeen(data.lastSeen));
    socket.on("conversationHistory", (messages) => {
      setMessages(messages);
      setIsLoading(false);
    });
    socket.on("messageReceived", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("messageError", (error) => {
      if (error.message === "Unauthorized") {
        window.location.href = "/login";
      } else {
        setErrorMessage(error.message);
        setTimeout(() => setErrorMessage(null), 2000);
      }
    });
    socket.on("messageUpdate", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id
            ? {
                ...msg,
                status: updatedMessage.status,
                content: updatedMessage.content,
              }
            : msg
        )
      );
    });
    socket.on("isSeen", (updatedMessage) => {
      setMessages(updatedMessage);
    });
    socket.on("messageStatusUpdate", (updatedMessage) => {
      setMessages((prevMessages) => {
        if (prevMessages.length === 0) return prevMessages;
        const updatedMessages = [...prevMessages];
        const lastMessageIndex = updatedMessages.length - 1;
        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          sender: updatedMessage.sender,
          recipient: updatedMessage.recipient,
          status: updatedMessage.status,
          timestamp: updatedMessage.timestamp,
          _id: updatedMessage._id,
        };
        return updatedMessages;
      });
    });

    return () => {
      socket.off("isSeen");
      socket.off("messageReceived");
      socket.off("conversationHistory");
      socket.off("messageUpdate");
      socket.off("messageStatusUpdate");
      socket.off("messageError");
      socket.off("recipientLastSeen");
    };
  }, [recipientId]);

  const handleSendMessage = () => {
    if (input.trim() === "" && !selectedFile) return;
    if (editingMessageId) {
      socket.emit("updateMessage", {
        recipientId,
        messageId: editingMessageId,
        content: input,
      });
      setEditingMessageId(null);
    } else {
      const messageData = {
        content: input,
        status: "pending",
      };
      displayMessage(messageData);
      socket.emit("sendMessage", {
        recipientId,
        content: input,
      });
    }
    setInput("");
    setSelectedFile(null);
  };

  const displayMessage = (msg) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [recipientId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleOptions = (index) =>
    setShowOptions((prev) => (prev === index ? null : index));

  const deleteMessage = (index, forEveryone = true) => {
    const message = messages[index];
    if (message) {
      socket.emit("deleteMessage", {
        recipientId: message.recipient,
        messageId: message._id,
      });

      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === index
            ? {
                ...msg,
                content: forEveryone
                  ? "Message deleted"
                  : "Message deleted for you",
              }
            : msg
        )
      );
      setShowOptions(null);
    }
  };

  const startEditingMessage = (index) => {
    const message = messages[index];
    setInput(message.content);
    setEditingMessageId(message._id);
    setShowOptions(null);
  };

  return (
    <div className="flex flex-col w-full bg-transparent p-4 shadow-lg h-full md:h-screen border border-gray-500 overflow-hidden relative">
      {errorMessage && (
        <div className="bg-gray-300 text-black text-center py-2 rounded mb-2 transition-opacity duration-500">
          Some error Occurred
        </div>
      )}

      <div className="flex items-center mb-2 space-x-4">
        <img
          src={chatUser.profilePicture || pic}
          alt=""
          className="rounded-full h-10 w-10 md:h-14 md:w-14"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {chatUser.username}
          </h2>
          {recipientId && (
            <p className="text-[12px] text-gray-400">
              last seen at {formatLastSeen(lastSeen) || "recently"}
            </p>
          )}
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="relative flex-1 bg-gray-200 overflow-y-auto overflow-x-hidden mb-1 p-5"
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white bg-opacity-60 flex flex-col justify-center items-center">
            <Player src={loadingAnimation} className="w-24 h-24" autoplay loop />
            <p className="text-gray-500 text-sm mt-2">Loading conversation...</p>
          </div>
        )}
        {!isLoading &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`relative group my-1 py-2 rounded-lg transition-all break-all ${
                message.sender === recipientId
                  ? "chat-box-receiver-message text-gray-500 self-start px-2"
                  : "chat-box-sender-message shadow-2xl text-white self-end pl-2 pr-10"
              }`}
              style={{
                float: message.sender === recipientId ? "left" : "right",
                clear: "both",
                width: "auto",
                maxWidth: "60%",
              }}
            >
              <div className="break-all">
                {message.content && (
                  <span className="inline-block">{message.content}</span>
                )}
                {message.content !== "Message deleted" &&
                  message.sender !== recipientId && (
                    <span className="absolute bottom-1 right-2 text-xs m-1 ml-1 mt-1">
                      {message.status === "sent"
                        ? "✓"
                        : message.status === "seen"
                        ? "✓✓"
                        : message.status === "edited"
                        ? "edited"
                        : <FontAwesomeIcon icon={faClock} className="text-white-500" />}
                    </span>
                  )}
                {message.file &&
                  (message.type.startsWith("image/") ? (
                    <img
                      src={message.file}
                      alt="Chat media"
                      className="w-96 h-auto rounded-lg mt-2"
                    />
                  ) : (
                    <a
                      href={message.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-green-400 underline mt-2"
                    >
                      Download File
                    </a>
                  ))}
              </div>

              {message.content !== "Message deleted" && (
                <div
                  className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer ${
                    message.sender === recipientId
                      ? "chat-box-message-menu-receiver"
                      : "chat-box-message-menu-sender"
                  } backdrop-opacity-10 rounded-lg p-1 z-10`}
                  onClick={() => toggleOptions(index)}
                >
                  <ChevronDown className="text-gray-700 w-5 h-5" />
                </div>
              )}

              {showOptions === index && (
                <div
                  id={`message-options-${index}`}
                  className="absolute top-6 right-1 mt-1 w-24 pt-1 pb-1 bg-white rounded-sm shadow-md z-50 text-gray-600"
                >
                  {message.sender === recipientId ? (
                    <button
                      onClick={() => deleteMessage(index, true)}
                      className="block w-full text-left px-2 py-1 hover:bg-gray-300 rounded"
                    >
                      Delete
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditingMessage(index)}
                        className="block w-full text-left px-2 py-1 hover:bg-gray-300 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMessage(index, true)}
                        className="block w-full text-left px-2 py-1 hover:bg-gray-300 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="relative flex items-center chat-box-input">
        <button
          id="emoji-button"
          onClick={() => setShowPicker(!showPicker)}
          className="pl-2 pt-1 pr-1 ml-2 mr-2 cursor-pointer"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faSmile} className="text-gray-400 text-2xl" />
        </button>

        {showPicker && (
          <div
            id="emoji-picker"
            className="absolute bottom-12 left-0 z-50 bg-white shadow-md"
          >
            <EmojiPicker onEmojiClick={addEmoji} />
          </div>
        )}

        <input
          type="text"
          placeholder="Type something to send..."
          className="flex-1 p-3 focus:outline-none text-gray-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-400 mr-3 p-2 rounded-xl text-white cursor-pointer disabled:opacity-50"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
