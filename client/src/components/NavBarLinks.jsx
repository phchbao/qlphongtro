import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import { Add, ContactMail, Home, Save, Description, Chat, Notifications } from "@mui/icons-material";

const NavBarLinksOwner = ({ toggleMenu }) => {
  return (
    <>
      <Link to="/owner/room/post" onClick={toggleMenu} className="text-center">
        <Tooltip title="ĐĂNG BÀI" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to="/owner/contacts/all" onClick={toggleMenu} className="text-center">
        <Tooltip title="LIÊN HỆ" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <ContactMail />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to="/owner/rentDetail" onClick={toggleMenu} className="text-center">
        <Tooltip title="CHI TIẾT THUÊ" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <Description />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to="/owner/chat" onClick={toggleMenu} className="text-center">
        <Tooltip title="CHAT" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <Chat />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to="/owner/noti" onClick={toggleMenu} className="text-center">
        <Tooltip title="THÔNG BÁO" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <Notifications />
          </IconButton>
        </Tooltip>
      </Link>
    </>
  );
};

const NavBarLinksLodger = ({ toggleMenu }) => {
  return (
    <>
      <Link to="/lodger/rental-rooms/all" onClick={toggleMenu} className="text-center">
        <Tooltip title="PHÒNG ĐANG THUÊ" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <Home />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to="/lodger/tro-so/saved/all" onClick={toggleMenu} className="text-center">
        <Tooltip title="ĐÃ LƯU" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <Save />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to="/lodger/contacts/all" onClick={toggleMenu} className="text-center">
        <Tooltip title="LIÊN HỆ" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <ContactMail />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to="/lodger/chat" onClick={toggleMenu} className="text-center">
        <Tooltip title="CHAT" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <Chat />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to="/lodger/noti" onClick={toggleMenu} className="text-center">
        <Tooltip title="THÔNG BÁO" arrow>
          <IconButton
            sx={{
              color: "black",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            <Notifications />
          </IconButton>
        </Tooltip>
      </Link>
    </>
  );
};


export { NavBarLinksOwner, NavBarLinksLodger };
