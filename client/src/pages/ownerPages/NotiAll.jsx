import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "../../features/ownerUser/ownerUserSlice"; // Điều chỉnh đường dẫn tới slice
import axiosFetch from "../../utils/axiosCreate"; // Điều chỉnh đường dẫn tới axiosFetch

const NotiAll = () => {
  const dispatch = useDispatch();
  const { contacts, isLoading, alertMsg } = useSelector((state) => state.ownerUser);

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // Trạng thái gửi thông báo

  useEffect(() => {
    dispatch(getAllContacts({})); // Lấy danh sách toàn bộ liên hệ
  }, [dispatch]);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      setStatus({ type: "error", msg: "Vui lòng nhập thông báo." });
      return;
    }

    const formattedMessage = `All: ${message}`;

    if (contacts && contacts.length > 0) {
      try {
        await Promise.all(
          contacts.map((contact) =>
            axiosFetch.post("/noti/owner/send-message", {
              to: contact._id, // Gửi đến từng ID của người thuê
              message: formattedMessage,
            })
          )
        );
        setStatus({ type: "success", msg: "Thông báo đã gửi thành công đến tất cả người thuê." });
        setMessage(""); // Xóa nội dung thông báo sau khi gửi
      } catch (error) {
        setStatus({ type: "error", msg: "Lỗi khi gửi thông báo. Vui lòng thử lại." });
      }
    } else {
      setStatus({ type: "error", msg: "Không có người thuê nào để gửi thông báo." });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Thông báo đến tất cả người thuê</h1>
      {isLoading && <p>Đang tải danh sách người thuê...</p>}
      {alertMsg && <p style={{ color: "red" }}>{alertMsg}</p>}
      <textarea
        style={{ width: "100%", height: "100px", marginBottom: "10px", padding: "10px" }}
        placeholder=" Soạn thông báo..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleSendNotification}
      >
        Gửi đi
      </button>
      {status && (
        <p style={{ color: status.type === "success" ? "green" : "red", marginTop: "10px" }}>
          {status.msg}
        </p>
      )}
    </div>
  );
};

export default NotiAll;
