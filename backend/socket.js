const socketIo = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const messagesController = require("./controllers/chatController");
const User = require("./models/userModel");
const Notification = require("./models/notificationModel");

const users = {}; // userId -> socketId mapping
function setupSocket(server) {
  const io = socketIo(server, {
    path: "/socket.io", // Path for socket.io connections
    cors: {
      origin: "https://shop-circuit.onrender.com", // Match your frontend origin
      methods: ["GET", "POST"],
      allowedHeaders: ["cookie", "my-custom-header"],
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || ""); // Parse cookies

    const token = cookies.jwt; // Access token from cookies

    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
      socket.user = decoded; // Attach decoded user info to socket
      next();
    } catch (err) {
      console.error("JWT Verification Error:", err); // Log error if JWT verification fails
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    const userId = socket.user.id;
    const senderId = userId;
    users[userId] = socket.id;

    // Fetch Unread Notifications
    socket.on("fetchNotifications", async () => {
      try {
        const notifications = await Notification.find({
          receiver: userId,
          isRead: false,
        }).populate("sender", "username profilePicture");
        //console.log("Notifications found:", notifications);
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
    // Join room for sender and receiver, and retrieve conversation history
    socket.on("joinRoom", async (data) => {
      const { recipientId } = data;
      // Retrieve the recipient's last seen time from the database
      const recipient = await User.findById(recipientId);

      if (recipient && recipient.lastSeen) {
        socket.emit("recipientLastSeen", { lastSeen: recipient.lastSeen });
      }

      // Log senderId

      if (!senderId) {
        socket.emit("messageError", { message: "Unauthorized" });
        return;
      }

      const roomId = `${senderId}-${recipientId}`;
      socket.join(roomId);

      try {
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
      console.log("Emitting userList event...");
      socket.emit("userList");

      try {
        const response = await messagesController.getMessagesForRecipient(
          io,
          senderId
        );
        console.log("here is the response" + response);
        socket.emit("updateChatList", response);
      } catch (error) {
        console.error("Error in socket sendMessage:", error);
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
        if (!response) {
          throw new Error("No chat data returned");
        }

        socket.emit("messageUpdate", response);
      } catch (error) {
        console.error("Error in socket updateMessage:", error);
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
        if (!response || !response.chat) {
          throw new Error("No chat data returned");
        }

        socket.emit("messageDeleted", response.chat.messages);
      } catch (error) {
        console.error("Error in socket deleteMessage:", error);
        socket.emit("messageError", { message: error.message });
      }
    });

    socket.on("disconnect", async () => {
      await messagesController.updateLastSeen(senderId);
      console.log("Disconnected");
    });
  });
}

module.exports = setupSocket;
