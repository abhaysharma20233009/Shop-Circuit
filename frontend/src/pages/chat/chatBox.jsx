import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faPaperPlane,
  faTrash,
  faClock,
  faCheck,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import { ChevronDown } from "lucide-react";
import pic from "./defaultImg_shopCircuit.webp";
import { debounce } from "lodash";
import BlueDoubleTickIcon from './blueTickIcon';

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
  const [showPicker, setShowPicker] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  
  const messagesContainerRef = useRef(null);
  const recipientId = chatUser._id;

  // Debounced function to mark messages as seen
  const markAsSeen = useCallback(debounce(() => {
    socket.emit("markMessagesAsSeen", { recipientId });
  }, 300), [recipientId]);

  // Automatic message seen detection
  useEffect(() => {
    if (!messagesContainerRef.current) return;

    // Initial mark as seen
    markAsSeen();

    // Observer for message visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            markAsSeen();
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe the last few messages
    const messageElements = messagesContainerRef.current.querySelectorAll('.message');
    if (messageElements.length > 0) {
      // Observe last 3 messages
      for (let i = Math.max(0, messageElements.length - 3); i < messageElements.length; i++) {
        observer.observe(messageElements[i]);
      }
    }

    return () => observer.disconnect();
  }, [messages, markAsSeen]);

  // Click outside handler
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
        
        if (emojiPicker?.contains(event.target)) return;
        if (!emojiButton?.contains(event.target)) {
          setShowPicker(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions, showPicker]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);
  // Socket event handlers
  useEffect(() => {
    if (recipientId) {
      socket.emit("joinRoom", { recipientId });
    }

    const handlers = {
      recipientLastSeen: (data) => setLastSeen(data.lastSeen),
      conversationHistory: (messages) => setMessages(messages),
      messageReceived: (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
        markAsSeen(); 
      },
      messageError: (error) => {
        if (error.message === "Unauthorized") {
          window.location.href = "/login";
        } else {
          setErrorMessage(error.message);
          setTimeout(() => setErrorMessage(null), 2000);
        }
      },
      messageUpdate: (updatedMessage) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === updatedMessage._id
              ? { ...msg, status: updatedMessage.status, content: updatedMessage.content }
              : msg
          )
        );
      },
      isSeen: (updatedMessages) => setMessages(updatedMessages),
      messageStatusUpdate: (updatedMessage) => {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            ...updatedMessage
          };
          return updated;
        });
      }
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(handlers).forEach((event) => {
        socket.off(event);
      });
    };
  }, [recipientId, markAsSeen]);

 

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [recipientId, scrollToBottom]);

  const handleSendMessage = () => {
    if (input.trim() === "" && !selectedFile) return;
    scrollToBottom();
    if (editingMessageId) {
      socket.emit("updateMessage", {
        recipientId,
        messageId: editingMessageId,
        content: input,
      });
      setEditingMessageId(null);
    } else {
      const messageData = { content: input, status: "pending" };
      setMessages((prev) => [...prev, messageData]);
      socket.emit("sendMessage", { recipientId, content: input });
    }

    setInput("");
    setSelectedFile(null);
  };

  const addEmoji = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const toggleOptions = (index) => setShowOptions(prev => prev === index ? null : index);

  const deleteMessage = (index, forEveryone = true) => {
    const message = messages[index];
    if (message) {
      socket.emit("deleteMessage", {
        recipientId: message.recipient,
        messageId: message._id,
      });

      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === index
            ? { ...msg, content: forEveryone ? "Message deleted" : "Message deleted for you" }
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
    <div className="flex flex-col w-full bg-transparent p-4 shadow-lg h-full md:h-screen border border-gray-500 overflow-hidden">
      {errorMessage && (
        <div className="bg-gray-300 text-black text-center py-2 rounded mb-2 transition-opacity duration-500">
          {errorMessage}
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
        className="flex-1 bg-gray-200 overflow-y-auto overflow-x-hidden mb-1 p-5 overflow-hidden"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message relative group my-1 py-2 rounded-lg transition-all break-all
              ${message.sender === recipientId
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
                    {message.status === "sent" ? (
                      <FontAwesomeIcon icon={faCheck} className="text-xs" />
                    ) : message.status === "seen" ? (
                      <BlueDoubleTickIcon className="w-5 h-5" />
                    ) : message.status === "edited" ? (
                      <span className="text-xs italic">edited</span>
                    ) : (
                      <FontAwesomeIcon icon={faClock} className="text-xs text-gray-400" />
                    )}
                  </span>
                )}

              {message.file &&
                (message.type?.startsWith("image/") ? (
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
                style={{ pointerEvents: "auto" }}
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
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileInput"
          className="text-gray-500 pl-1 pr-1 cursor-pointer mr-2"
        >
          <FontAwesomeIcon icon={faPaperclip} />
        </label>

        <textarea
  placeholder="Type something to send..."
  className="flex-1 p-3 focus:outline-none text-gray-500 resize-none rounded break-words"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={handleKeyDown}
/>

        <button
          onClick={handleSendMessage}
          className="bg-green-400 mr-3 md:mr-6 p-2 rounded-xl text-white cursor-pointer"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
