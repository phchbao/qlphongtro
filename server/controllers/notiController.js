import Noti from "../models/Notis.js";

/**
 * @description Send message
 * @returns {object} message
 */
const sendMessage = async (req, res) => {
  const { to, message } = req.body;
  const { userId: from } = req.user;
  const newMessage = await Noti.create({
    notiUsers: [from, to],
    message,
    sender: from,
  });
  res.status(201).json({ newMessage, msg: "Tin nhắn đã gửi thành công!" });
};

/**
 * @description Get all messages for a noti
 * @returns {object} message
 */
const getMessages = async (req, res) => {
  const { to } = req.body;
  const { userId: from } = req.user;

  const msgs = await Noti.find({
    notiUsers: { $all: [from, to] },
  }).sort({ createdAt: 1 });

  const messages = msgs.map((msg) => {
    return {
      fromSelf: msg.sender === from,
      message: msg.message,
    };
  });
  return res.status(200).json({ messages });
};

export { sendMessage, getMessages };
