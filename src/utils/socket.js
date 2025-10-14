const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { timeStamp } = require("console");
const { Complaint } = require("../models/complaints");

const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "https://lnmcms-frontend.vercel.app"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      exposedHeaders: ["Set-Cookie"],
      optionsSuccessStatus: 200,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId({ userId, targetUserId });
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ name, userId, userRole, targetUserId, text, complaintId }) => {
        try {
          const roomId = getSecretRoomId({ userId, targetUserId });
          let chat = await Chat.findOne({
            student: { $in: [userId, targetUserId] },
            admin: { $in: [userId, targetUserId] },
            ...(complaintId && { complaintId }),
          });
          if (!chat) {
            chat = new Chat({
              student: userRole === "student" ? userId : targetUserId,
              admin: userRole === "admin" ? userId : targetUserId,
              ...(complaintId && { complaintId }),
              messages: [],
            });
          }

          chat.messages.push({
            studentId: userRole === "student" ? userId : null,
            adminId: userRole === "admin" ? userId : null,
            sender: userRole,
            text,
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            name,
            text,
            userRole,
            timeStamp: new Date(),
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
