const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
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
    }).populate({
        path: "messages.studentId messages.adminId",
        select: "name email rollNumber department",
    }) ;
    if (!chat) {
        chat = new Chat({
        student: req?.user?.role === "student" ? userId : targetUserId,
        admin: req?.user?.role === "admin" ? userId : targetUserId,
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { chatRouter };
