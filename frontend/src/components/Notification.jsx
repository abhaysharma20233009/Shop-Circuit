import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  path: "/socket.io",
});

const NotificationDropdown = ({ sendData }) => {
  const [notifications, setNotifications] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on("newMessageNotification", (data) => {
      console.log("New message notification:", data);

      setNotifications((prev) => {
        const updatedNotifications = { ...prev };

        if (updatedNotifications[data.sender._id]) {
          // Agar sender already exist karta hai, to message update kar aur count badha de
          updatedNotifications[data.sender._id].count += 1;
          updatedNotifications[data.sender._id].latestMessage =
            data.messagePreview;
        } else {
          // Naya sender hai to naye data ke sath add kar
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

    // Fetch all unread notifications from DB
    socket.emit("fetchNotifications");

    socket.on("allNotifications", (fetchedNotifications) => {
      console.log("Notifications:", fetchedNotifications);

      const updatedNotifications = {};

      fetchedNotifications.forEach((notif) => {
        const senderId = notif.sender._id;

        if (updatedNotifications[senderId]) {
          // Agar sender already exist karta hai, to message update kar aur count badha de
          updatedNotifications[senderId].count += 1;
          updatedNotifications[senderId].latestMessage = notif.messagePreview;
        } else {
          // Naya sender hai to naye data ke sath add kar
          updatedNotifications[senderId] = {
            sender: notif.sender,
            latestMessage: notif.messagePreview,
            count: 1,
          };
        }
      });

      setNotifications(updatedNotifications);
      setCount(Object.keys(updatedNotifications).length);
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

  // Mark all notifications as read
  const markAsRead = () => {
    socket.emit("markNotificationsAsRead");
    setNotifications({});
    setCount(0);
  };

  // Send count to parent whenever count updates
  useEffect(() => {
    sendData(count);
  }, [count, sendData]);

  return (
    <div className="absolute z-10 right-0 mt-48 w-72 h-auto bg-gray-700 text-white border border-gray-600 shadow-lg rounded-md p-2 bell-dropdown">
      <h3 className="text-lg font-semibold">Notifications ({count})</h3>
      {count === 0 ? (
        <p className="text-gray-400 text-center">No notifications</p>
      ) : (
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-gray-100 scrollbar-gray-900 scroll-bg-gray-900">
          {Object.values(notifications).map(({ sender, latestMessage, count }) => (
            <div
              key={sender._id}
              className="flex items-center gap-3 p-2 border-b border-gray-600"
            >
              <img
                src={sender.profilePicture || "../assets/productImg.jpg"}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <strong>{sender.username}</strong>
                <p className="text-sm text-gray-300">
                  {latestMessage} ({count} messages)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {count > 0 && (
        <button
          className="text-sm text-blue-400 mt-2 w-full"
          onClick={markAsRead}
        >
          Mark all as Read
        </button>
      )}
    </div>
  );
};

export default NotificationDropdown;
