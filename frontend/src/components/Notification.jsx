import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from "react-router-dom";
import loadingAnimation from "../assets/loading.json";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  path: "/socket.io",
});

const NotificationDropdown = ({ sendData }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({});
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Initially set to true

  useEffect(() => {
    socket.on("newMessageNotification", (data) => {
      console.log("New message notification:", data);
      setIsLoading(false);

      setNotifications((prev) => {
        const updatedNotifications = { ...prev };
        if (updatedNotifications[data.sender._id]) {
          updatedNotifications[data.sender._id].count += 1;
          updatedNotifications[data.sender._id].latestMessage = data.messagePreview;
        } else {
          updatedNotifications[data.sender._id] = {
            sender: data.sender,
            latestMessage: data.messagePreview,
            count: 1,
          };
        }
        return updatedNotifications;
      });

      setCount((prevCount) => prevCount + 1);
    });

    socket.emit("fetchNotifications");

    socket.on("allNotifications", (fetchedNotifications) => {
      console.log("Notifications:", fetchedNotifications);

      const updatedNotifications = {};
      fetchedNotifications.forEach((notif) => {
        const senderId = notif.sender._id;
        if (updatedNotifications[senderId]) {
          updatedNotifications[senderId].count += 1;
          updatedNotifications[senderId].latestMessage = notif.messagePreview;
        } else {
          updatedNotifications[senderId] = {
            sender: notif.sender,
            latestMessage: notif.messagePreview,
            count: 1,
          };
        }
      });

      setNotifications(updatedNotifications);
      setCount(Object.keys(updatedNotifications).length);
      setIsLoading(false); // Loading is done
    });

    socket.on("notificationsMarkedAsRead", () => {
      setNotifications({});
      setCount(0);
    });

    return () => {
      socket.off("newMessageNotification");
      socket.off("allNotifications");
      socket.off("notificationsMarkedAsRead");
    };
  }, []);

  const markAsRead = () => {
    socket.emit("markNotificationsAsRead");
    setNotifications({});
    setCount(0);
  };

  useEffect(() => {
    sendData(count);
  }, [count, sendData]);

  const handleClick = (id) => () => {
    if (id) {
      navigate(`/chat`, { state: { id } });
    }
  };

  return (
    <div className="absolute z-50 right-0 mt-6 w-80 bg-gray-900/80 backdrop-blur-2xl border border-cyan-500 shadow-xl rounded-2xl p-4 bell-dropdown transition-all duration-300 ease-in-out hover:shadow-cyan-500/50">
      <h3 className="text-lg font-semibold text-cyan-300 flex justify-between items-center">
        Notifications <span className="text-cyan-400">({count})</span>
      </h3>

      {/* Show loading animation before showing notifications */}
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <Player src={loadingAnimation} className="w-16 h-16" autoplay loop />
        </div>
      ) : (
        <>
          {count === 0 ? (
            <p className="text-gray-400 text-center py-4">No new notifications</p>
          ) : (
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {Object.values(notifications).map(({ sender, latestMessage, count }) => (
                <div
                  key={sender._id}
                  className="flex items-center gap-3 p-3 border-b border-gray-600 hover:bg-gray-800/50 transition-all duration-200 rounded-lg"
                  onClick={handleClick(sender._id)}
                >
                  <img
                    src={sender.profilePicture || "../assets/productImg.jpg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-cyan-400 shadow-md"
                  />
                  <div className="flex-1">
                    <strong className="text-cyan-300">{sender.username}</strong>
                    <p className="text-sm text-gray-300">
                      {latestMessage} <span className="text-cyan-400">({count} new)</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {count > 0 && !isLoading && (
        <button
          className="text-sm text-cyan-300 mt-3 w-full py-2 bg-gray-800/50 border border-cyan-500 rounded-lg transition-all hover:bg-cyan-500/30 hover:text-white shadow-md hover:shadow-cyan-500"
          onClick={markAsRead}
        >
          Mark all as Read
        </button>
      )}
    </div>
  );
};

export default NotificationDropdown;
