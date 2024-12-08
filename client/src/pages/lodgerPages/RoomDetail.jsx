import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  getSingleRoom,
  clearAlert,
  sendEmailToOwner,
} from "../../features/roomLodger/roomLodgerSlice";
import {
  RoomDetailCard,
  PageLoading,
  Footer,
  AlertToast,
  ConfirmModal,
} from "../../components";
import { format } from "../../utils/valueFormatter";
import {
  Button,
  CardActionArea,
  Avatar,
  CircularProgress,
} from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import axiosFetch from "../../utils/axiosCreate";

const RoomDetail = () => {
  const {
    room,
    isLoading,
    alertFlag,
    alertMsg,
    alertType,
    isSaved,
    isProcessing,
  } = useSelector((state) => state.roomLodger);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getSingleRoom({ slug }));
  }, [slug, dispatch]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formValues, setFormData] = useState({});

  const handleSendConfirmation = (e) => {
    e.preventDefault();

    const emailTemplate = {
      to: room?.roomOwner?.email,
      from: user?.email,
      subject: `Yêu cầu thuê phòng: ${room?.roomId}`,
      body: `<p>Xin chào ${room?.roomOwner?.lastName} ${room?.roomOwner?.firstName},</p>
      <p> Tôi tên là <a href="${import.meta.env.VITE_APP_BASE_URL}/#/owner/lodger-user/${user?.slug}"><strong>${user?.lastName} ${user?.firstName}</strong></a>,
      <p>Tôi muốn thuê phòng <strong>${room?.title}</strong> với mã: ${room?.roomId}.</p>
      <p>Mong bạn phản hồi sớm</p>
      <p>.......................................</p>
      <p>${user?.lastName} ${user?.firstName},</p>
      <p>${user?.email}</p>
      <p>${user?.phoneNumber}</p>`,
    };

    setFormData(emailTemplate);
    handleModalOpen();
  };

  const handleEmailSend = useCallback(() => {
    dispatch(sendEmailToOwner({ formValues }));
    handleModalClose();
    axiosFetch
      .post("/noti/lodger/send-message", {
        to: room?.roomOwner?._id,
        message: `Tôi đang quan tâm đến phòng có có mã  ${room?.roomId} của bạn: ${import.meta.env.VITE_APP_BASE_URL}/#/owner/tro-so/${room?.slug}`,
        
      })
      .then((response) => {
        console.log("Tin nhắn đã được gửi:", response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi gửi tin nhắn:", error.response?.data || error.message);
      });
  }, [dispatch, formValues, handleModalClose]);

  if (isLoading) return <PageLoading />;

  if (!room)
    return <h1 className="mt-6 text-center">Bạn chưa thuê phòng nào</h1>;

  return (
    <>
      <main className="flex gap-2 flex-col mb-12 lg:flex-row">
        <div className="flex flex-col gap-8 mt-10 mx-auto p-4 lg:w-8/12 lg:ml-14">
          <RoomDetailCard
            {...room}
            fromLodger
            isSaved={isSaved}
            isProcessing={isProcessing}
          />

          <div className="">
            <h3 className="font-semibold p-3">Mô tả</h3>
            <hr className="w-3/4 ml-3 border-t-2 rounded-md" />
            <p className="text-lg p-3 tracking-normal">
              {room?.description}
            </p>
          </div>
          <div className="">
            <h3 className="font-semibold p-3">Tổng quan</h3>
            <hr className="w-3/4 ml-3 border-t-2 rounded-md" />
            <div className="flex flex-wrap">
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <SquareFootRoundedIcon sx={{ color: "#738FA7" }} />
                </span>
                <span className="font-semibold">Diện tích phòng</span>
                <p className="">{format(room?.area)} m2</p>
              </div>
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <HorizontalSplitRoundedIcon />
                </span>
                <span className="font-semibold">
                  Số {room?.beds > 1 ? "giường" : "giường"}
                </span>
                <p className="">{format(room?.beds)} </p>
              </div>
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <ExploreRoundedIcon sx={{ color: "#29b46e" }} />
                </span>
                <span className="font-semibold"> Tiện nghi </span>
                <p className="">{room?.amenities}</p>
              </div>
            </div>
          </div>
        </div>
        <aside className="mx-4 my-10 p-4 lg:w-1/3 lg:mr-14">
          <Link to={`/lodger/owner-user/${room?.roomOwner?.slug}`}>
            <CardActionArea sx={{ borderRadius: "0.375rem" }}>
              <div className="shadow-lg rounded-md p-4">
                <div className="flex gap-2 items-center">
                  <h4 className="font-medium">Thông tin liên hệ</h4>
                  <ContactsRoundedIcon color="secondary" />
                </div>
                <div className="flex mt-4 gap-2 items-center">
                  <Avatar
                    src={room?.roomOwner?.profileImage}
                    alt={(room?.roomOwner?.firstName).toUpperCase()}
                  />
                  <p className="leading-4">
                    {room?.roomOwner?.firstName}{" "}
                    {room?.roomOwner?.lastName}
                  </p>
                </div>
                <div className="flex mt-2 ml-1 gap-2 items-center">
                  <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                  <p className="ml-3">
                    {room?.roomOwner?.phoneNumber}
                  </p>
                </div>
                <div className="flex mt-2 ml-1 gap-2 items-center">
                  <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                  <p className="overflow-auto">
                    {room?.roomOwner?.email}
                  </p>
                </div>
              </div>
            </CardActionArea>
          </Link>
          <div className="mt-8 shadow-lg rounded-md p-4">
            <form className="overflow-x-auto" onSubmit={handleSendConfirmation}>
              <div className="flex gap-2 items-center">
                <h4 className="font-medium">LIÊN HỆ</h4>
                <ForwardToInboxRoundedIcon color="tertiary" />
              </div>
              <div className="flex mt-4 gap-2 items-center">
                <span className="font-semibold"> To: </span>
                <p className="">{room?.roomOwner?.email}</p>
              </div>
              <div className="flex mt-2 gap-2 items-center">
                <span className="font-semibold"> From: </span>
                <p className="">{user?.email}</p>
              </div>
              <div className="flex mt-2 gap-2 items-center">
                <span className="font-semibold"> Subject: </span>
                <p>
                  Yêu cầu thuê phòng:{" "}
                  <span className="text-sm">{room?.roomId}</span>
                </p>
              </div>
              <div className="flex mt-2 gap-2 items-start">
                <span className="font-semibold"> Body: </span>
                <div className="text-sm mt-1">
                  <p>
                    Xin chào {room?.roomOwner?.lastName} {room?.roomOwner?.firstName},
                  </p>
                  <br />
                  <p>Tôi tên là{" "}
                    <strong>
                       {user?.lastName} {user?.firstName}
                    </strong></p>
                  <p>
                    Tôi muốn thuê phòng{" "}
                    <strong>{room?.title}</strong> vỡi mã:{" "}
                    {room?.roomId}.
                  </p>
                  <p>

                    <p>Mong bạn phản hồi sớm</p>
                  </p>

                  <br />
                  
                  <p>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p> 
                  {user?.email}
                  </p>
                  <p> 
                  {user?.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex mt-2 gap-2 justify-end py-2">
                <Button
                  type="submit"
                  variant="contained"
                  color="tertiary"
                  sx={{ color: "#fff" }}
                  size="small"
                  startIcon={<SendRoundedIcon />}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <CircularProgress
                      size={26}
                      sx={{
                        color: "#fff",
                        width: "25%",
                      }}
                    />
                  ) : (
                    "Đặt phòng"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </aside>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">Đặt phòng</h3>
          <p className="text-center my-4">
            Xác nhận yêu cầu?
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="error">
              Không
            </Button>

            <Button
              onClick={handleEmailSend}
              color="success"
              variant="contained"
            >
              Có
            </Button>
          </div>
        </ConfirmModal>
        <AlertToast
          alertFlag={alertFlag}
          alertMsg={alertMsg}
          alertType={alertType}
          handleClose={handleAlertClose}
        />
      </main>
      <Footer />
    </>
  );
};

export default RoomDetail;
