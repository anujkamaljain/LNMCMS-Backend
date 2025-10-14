const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    sender: { type: String, enum: ["student", "admin"], required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    index: true,
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", index: true },
  messages: [messageSchema],
  lastReadByStudent: { type: Date, default: Date.now },
  lastReadByAdmin: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };
