import { useEffect, useState, useRef, useCallback } from "react";
import axiosFetch from "../utils/axiosCreate";
import NotiInput from "../components/NotiInput";
import { Link } from "react-router-dom";

const NotiMessages = ({ noti, currentUser, socket, fromLodger }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [socketMessage, setSocketMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getMessage = useCallback(
    async (notiId) => {
      try {
        setIsLoaded(false);

        const { data } = await axiosFetch.post(
          `/noti/${fromLodger ? "lodger" : "owner"}/get-messages`,
          {
            to: notiId,
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
        <p>Chọn liên hệ cụ thể để xem thông báo</p>
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

  // Lọc tin nhắn dựa trên vai trò của người dùng
  const filteredMessages = messages.filter((message) => {
    if (!fromLodger && !message.fromSelf) return true; // Owner chỉ xem tin nhắn từ Lodger
    if (fromLodger && !message.fromSelf) return true; // Lodger chỉ xem tin nhắn từ Owner
    return false;
  });

  return (
    <div className="flex flex-col w-full" style={{ maxHeight: "500px" }}>
      <Link
        to={`${fromLodger ? "/lodger/owner-user" : "/owner/lodger-user"}/${
          noti?.slug
        }`}
      >
        <div className="flex items-center gap-4 py-4 cursor-pointer">
          <img
            src={noti?.profileImage}
            alt="pfp"
            className="w-8 h-8 rounded-full object-cover md:w-12 md:h-12"
          />
          <p className="font-roboto md:text-lg">
            {noti?.firstName} {noti?.lastName}
          </p>
        </div>
      </Link>

      <div className="overflow-auto">
        {filteredMessages.length === 0 ? (
          <div className="flex justify-center items-center h-64 w-full">
            <p>Chưa có thông báo mới</p>
          </div>
        ) : (
          filteredMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.fromSelf ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              <div
                className={`flex items-center gap-4 p-1 md:p-2 rounded-2xl my-1 ${
                  message.message.startsWith("All:")
                    ? "bg-red-500 text-white"
                    : message.fromSelf
                    ? "bg-white"
                    : "bg-primary text-white"
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
        <NotiInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default NotiMessages;
