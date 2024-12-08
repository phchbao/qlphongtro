import { useEffect, useState, useRef, useCallback } from "react";
import axiosFetch from "../utils/axiosCreate";
import ChatInput from "../components/ChatInput"; // Cập nhật đường dẫn chính xác
import { Link } from "react-router-dom";

const ChatMessages = ({ chat, currentUser, socket, fromLodger }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [socketMessage, setSocketMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getMessage = useCallback(
    async (chatId) => {
      try {
        setIsLoaded(false);

        const { data } = await axiosFetch.post(
          `/chat/${fromLodger ? "lodger" : "owner"}/get-messages`,
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
    if (chat?._id) {
      getMessage(chat?._id);
    }
  }, [chat, getMessage]);

  const handleSendMessage = async (msgInput) => {
    try {
      await axiosFetch.post(
        `/chat/${fromLodger ? "lodger" : "owner"}/send-message`,
        {
          to: chat?._id,
          message: msgInput,
        }
      );

      socket.current.emit("sendMsg", {
        to: chat?._id,
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
        <p>Chọn liên hệ cụ thể để xem tin nhắn</p>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <p>Click on a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full" style={{ maxHeight: "500px" }}>
      <Link
        to={`${fromLodger ? "/lodger/owner-user" : "/owner/lodger-user"}/${
          chat?.slug
        }`}
      >
        <div className="flex items-center gap-4 py-4 cursor-pointer">
          <img
            src={chat?.profileImage}
            alt="pfp"
            className="w-8 h-8 rounded-full object-cover md:w-12 md:h-12"
          />
          <p className="font-roboto md:text-lg">
            {chat?.firstName} {chat?.lastName}
          </p>
        </div>
      </Link>

      <div className="overflow-auto">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-64 w-full">
            <p>No messages yet</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.fromSelf ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              <div
                className={`flex items-center gap-4 p-1 md:p-2 rounded-2xl my-1 ${
                  message.fromSelf ? "bg-white" : "bg-primary text-white"
                }`}
                dangerouslySetInnerHTML={{
                  __html: formatMessage(message.message),
                }}
              ></div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatMessages;
