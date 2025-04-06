const socketIo = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const messagesController = require("./controllers/chatController");
const User = require("./models/userModel");
const Notification = require("./models/notificationModel");

const users = {}; // userId -> socketId mapping
const onlineUsers = new Map(); // userId -> socketId

function setupSocket(server) {
  const io = socketIo(server, {
    path: "/socket.io",
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["cookie", "my-custom-header"],
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.jwt;

    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("JWT Verification Error:", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    const userId = socket.user.id;
    const senderId = userId;

    users[userId] = socket.id;
    onlineUsers.set(userId, socket.id);

    // Fetch Unread Notifications
    socket.on("fetchNotifications", async () => {
      try {
        const notifications = await Notification.find({
          receiver: userId,
          isRead: false,
        }).populate("sender", "username profilePicture");
        socket.emit("allNotifications", notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    });

    // Mark Notifications as Read
    socket.on("markNotificationsAsRead", async () => {
      try {
        await Notification.updateMany(
          { receiver: userId, isRead: false },
          { isRead: true }
        );
        socket.emit("notificationsMarkedAsRead");
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    });

    // Join room and send online/lastSeen info
    socket.on("joinRoom", async (data) => {
      const { recipientId } = data;

      if (!senderId) {
        socket.emit("messageError", { message: "Unauthorized" });
        return;
      }

      const roomId = `${senderId}-${recipientId}`;
      socket.join(roomId);

      try {
        if (onlineUsers.has(recipientId)) {
          socket.emit("recipientOnline", { userId: recipientId });
        } else {
          const recipient = await User.findById(recipientId);
          if (recipient && recipient.lastSeen) {
            socket.emit("recipientLastSeen", { lastSeen: recipient.lastSeen });
          }
        }

        const conversation = await messagesController.getAllMessages(
          senderId,
          recipientId
        );
        socket.emit("conversationHistory", conversation.messages);
      } catch (error) {
        console.error("Error loading conversation history:", error);
        socket.emit("messageError", {
          message: "Could not load conversation history.",
        });
      }
    });

    socket.on("markMessagesAsSeen", async (data) => {
      const { recipientId } = data;

      if (!senderId) {
        socket.emit("messageError", { message: "Unauthorized" });
        return;
      }

      try {
        const updatedMessages = await messagesController.markAllMessagesAsSeen(
          io,
          senderId,
          recipientId
        );

        const roomId = `${senderId}-${recipientId}`;
        io.to(roomId).emit("isSeen", updatedMessages.messages);
      } catch (error) {
        console.error("Error marking messages as seen:", error);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { recipientId, content } = data;

      if (!senderId) {
        socket.emit("messageError", { message: "Unauthorized" });
        return;
      }

      try {
        const response = await messagesController.createMessage(
          io,
          senderId,
          recipientId,
          content
        );
        socket.emit("messageStatusUpdate", response);
      } catch (error) {
        console.error("Error in socket sendMessage:", error);
        socket.emit("messageError", {
          message: error.message || "Internal server error",
        });
      }
    });

    socket.on("userList", async () => {
      if (!senderId) {
        socket.emit("messageError", { message: "Unauthorized" });
        return;
      }

      try {
        socket.emit("userList");
        const response = await messagesController.getMessagesForRecipient(
          io,
          senderId
        );
        socket.emit("updateChatList", response);
      } catch (error) {
        console.error("Error in userList:", error);
        socket.emit("messageError", {
          message: error.message || "Internal server error",
        });
      }
    });

    socket.on("updateMessage", async (data) => {
      const { recipientId, messageId, content } = data;

      if (!senderId) {
        socket.emit("messageError", { message: "Unauthorized" });
        return;
      }

      try {
        const response = await messagesController.updateMessage(
          io,
          senderId,
          messageId,
          content
        );
        if (!response) throw new Error("No chat data returned");

        socket.emit("messageUpdate", response);
      } catch (error) {
        console.error("Error in updateMessage:", error);
        socket.emit("messageError", { message: error.message });
      }
    });

    socket.on("deleteMessage", async (data) => {
      const { recipientId, messageId } = data;

      if (!senderId) {
        socket.emit("messageError", { message: "Unauthorized" });
        return;
      }

      try {
        const response = await messagesController.deleteMessage(
          io,
          senderId,
          messageId
        );
        if (!response || !response.chat) throw new Error("No chat data returned");

        socket.emit("messageDeleted", response.chat.messages);
      } catch (error) {
        console.error("Error in deleteMessage:", error);
        socket.emit("messageError", { message: error.message });
      }
    });
    socket.on("getUserStatus", ({ userId }, callback) => {
      try {
        const isOnline = onlineUsers.has(userId);
       
        
        callback({isOnline});
      } catch (error) {
        callback({ error: "Failed to get user status" });
      }
    });
    socket.on("disconnect", async () => {
      onlineUsers.delete(senderId);
      await messagesController.updateLastSeen(senderId);

      console.log("A user disconnected");
    });
  });
}

module.exports = setupSocket;
