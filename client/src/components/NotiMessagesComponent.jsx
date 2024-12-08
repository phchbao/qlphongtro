import { useEffect, useState, useRef, useCallback } from "react";
import axiosFetch from "../utils/axiosCreate";
import NotiInput from "../components/NotiInput"; // Cập nhật đường dẫn chính xác
import { Link } from "react-router-dom";

const NotiMessages = ({ noti, currentUser, socket, fromLodger }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [socketMessage, setSocketMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getMessage = useCallback(
    async (chatId) => {
      try {
        setIsLoaded(false);

        const { data } = await axiosFetch.post(
          `/noti/${fromLodger ? "lodger" : "owner"}/get-messages`,
          {
            to: chatId,
          }
        );

        setIsLoaded(true);
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [fromLodger]
  );

  useEffect(() => {
    if (noti?._id) {
      getMessage(noti?._id);
    }
  }, [noti, getMessage]);

  const handleSendMessage = async (msgInput) => {
    try {
      await axiosFetch.post(
        `/noti/${fromLodger ? "lodger" : "owner"}/send-message`,
        {
          to: noti?._id,
          message: msgInput,
        }
      );

      socket.current.emit("sendMsg", {
        to: noti?._id,
        from: currentUser?._id,
        message: msgInput,
      });

      setMessages((prev) => [...prev, { fromSelf: true, message: msgInput }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("receiveMsg", (msg) => {
        setSocketMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socketMessage) {
      setMessages((prev) => [...prev, socketMessage]);
    }
  }, [socketMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessage = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" style="color: blue; text-decoration: underline;">${url}</a>`;
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <p>Ấn để xem thông báo</p>
      </div>
    );
  }

  if (!noti) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <p>Click on a noti to start messaging</p>
      </div>
    );
  }

  return (
<div className="overflow-auto">
  {messages.filter((message) => !message.fromSelf).length === 0 ? (
    <div className="flex justify-center items-center h-64 w-full">
      <p>Đang cập nhật...</p>
    </div>
  ) : (
    messages
      .filter((message) => !message.fromSelf) // Chỉ hiển thị tin nhắn không phải từ người gửi
      .map((message, index) => (
        <div
          key={index}
          className={`flex justify-start`}
          ref={scrollRef}
        >
          <div
            className={`flex items-center gap-4 p-1 md:p-2 rounded-2xl my-1 bg-primary text-white`}
            dangerouslySetInnerHTML={{
              __html: formatMessage(message.message),
            }}
          ></div>
        </div>
      ))
  )}
</div>

  );
};

export default NotiMessages;
