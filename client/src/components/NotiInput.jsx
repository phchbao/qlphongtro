import { useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button } from "@mui/material";

const NotiInput = ({ handleSendMessage }) => {
  const [msgInput, setMsgInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (msgInput.length > 0) {
      handleSendMessage(msgInput);
      setMsgInput("");
    }
  };

  return (
    <>
      <form className="form" onSubmit={(e) => sendMessage(e)}>
        <div className="flex items-center gap-1 md:gap-4">
          <input
            type="text"
            placeholder="Soạn thông báo"
            value={msgInput}
            onChange={(e) => {
              setMsgInput(e.target.value);
            }}
            className="flex-grow md:px-5 py-3 rounded-full focus:outline-none hidden" // Thêm lớp hidden
          />
          <Button type="submit" style={{ display: "none" }}> {/* Inline style */}
            <SendRoundedIcon fontSize="large" sx={{ color: "#0496b4" }} />
          </Button>
        </div>
      </form>
    </>
  );
};

export default NotiInput;
