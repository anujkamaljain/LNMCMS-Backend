const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const { complaintId } = req.query;
  const userId = req?.user?._id;
  try {
    if (!userId || !targetUserId) {
      return res
        .status(400)
        .json({ message: "senderId and receiverId are required" });
    }
    let chat = await Chat.findOne({
      student: { $in: [userId, targetUserId] },
      admin: { $in: [userId, targetUserId] },
      ...(complaintId && { complaintId }),
    }).populate({
        path: "messages.studentId messages.adminId",
        select: "name email rollNumber department",
    }) ;
    if (!chat) {
        chat = new Chat({
        student: req?.user?.role === "student" ? userId : targetUserId,
        admin: req?.user?.role === "admin" ? userId : targetUserId,
        ...(complaintId && { complaintId }),
        messages: [],
        lastReadByStudent: new Date(),
        lastReadByAdmin: new Date(),
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Check for unread messages
chatRouter.get("/chat/:targetUserId/unread", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const { complaintId } = req.query;
  const userId = req?.user?._id;
  const userRole = req?.user?.role;
  
  try {
    if (!userId || !targetUserId) {
      return res
        .status(400)
        .json({ message: "senderId and receiverId are required" });
    }
    
    const chat = await Chat.findOne({
      student: { $in: [userId, targetUserId] },
      admin: { $in: [userId, targetUserId] },
      ...(complaintId && { complaintId }),
    });
    
    if (!chat) {
      return res.json({ hasUnread: false, unreadCount: 0 });
    }
    
    const lastReadField = userRole === "student" ? "lastReadByStudent" : "lastReadByAdmin";
    const lastReadTime = chat[lastReadField];
    
    // Count messages after last read time
    const unreadCount = chat.messages.filter(msg => {
      return new Date(msg.createdAt) > new Date(lastReadTime) && msg.sender !== userRole;
    }).length;
    
    res.json({ 
      hasUnread: unreadCount > 0, 
      unreadCount 
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Mark messages as read
chatRouter.post("/chat/:targetUserId/read", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const { complaintId } = req.body;
  const userId = req?.user?._id;
  const userRole = req?.user?.role;
  
  try {
    if (!userId || !targetUserId) {
      return res
        .status(400)
        .json({ message: "senderId and receiverId are required" });
    }
    
    const chat = await Chat.findOne({
      student: { $in: [userId, targetUserId] },
      admin: { $in: [userId, targetUserId] },
      ...(complaintId && { complaintId }),
    });
    
    if (chat) {
      const lastReadField = userRole === "student" ? "lastReadByStudent" : "lastReadByAdmin";
      chat[lastReadField] = new Date();
      await chat.save();
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { chatRouter };
