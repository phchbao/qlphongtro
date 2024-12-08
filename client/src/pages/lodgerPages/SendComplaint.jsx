import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleRoom,
  sendComplaintToOwner,
  clearAlert,
} from "../../features/roomLodger/roomLodgerSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, ConfirmModal, AlertToast } from "../../components";
import { Button, CircularProgress, TextField } from "@mui/material";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import axiosFetch from "../../utils/axiosCreate";

const SendComplaint = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const {
    isLoading,
    room,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    success,
  } = useSelector((state) => state.roomLodger);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSingleRoom({ slug }));
  }, [slug, dispatch]);

  // Redirect to detail page of the room after successful contract creation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/lodger/rental-rooms/${slug}`);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, slug]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const initialFormValues = {
    to: "",
    from: "",
    subject: "",
    body: "",
    message: "",
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...formValues, [e.target.name]: e.target.value });
    },
    [formValues]
  );

  //modal state and handlers
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const handleSendConfirmation = (e) => {
    e.preventDefault();

    const emailTemplate = {
      to: room?.roomOwner?.email,
      from: user?.email,
      body: `
        <p>Xin chào ${room?.roomOwner?.lastName}  ${room?.roomOwner?.firstName},</p>
        <p>${formValues.message}</p>
       <p>..................</p> 
        <p>Trân trọng,</p>
        <p>${user?.firstName} ${user?.lastName}</p>
      `,
    };

    setFormValues({ ...formValues, ...emailTemplate });
    handleModalOpen();
  };

  const handleEmailSend = useCallback(() => {
    dispatch(sendComplaintToOwner({ formValues }));
    handleModalClose();
    axiosFetch
    .post("/noti/lodger/send-message", {
      to: room?.roomOwner?._id,
      message: `Mã phòng ${room?.roomId}: ${formValues.message}`,
      
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
    return (
      <h1 className="mt-6 text-center">Email Credential Values Not Found</h1>
    );

  return (
    <main className="mt-10 mb-12 mx-8 md:mx-12">
      <div className="flex gap-2 mb-4">
        <h4 className="font-heading font-bold">Gửi góp ý cho bên thuê</h4>
        <ForwardToInboxRoundedIcon color="tertiary" />
      </div>
      <div className="shadow-lg rounded-md p-8 overflow-auto">
        <form onSubmit={handleSendConfirmation}>
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
            <div className="w-full">
              <TextField
                required
                multiline
                variant="standard"
                rows={1}
                color="tertiary"
                placeholder="Tiêu đề"
                name="subject"
                value={formValues.subject}
                onChange={handleChange}
                sx={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="flex mt-2 gap-2 items-start">
            <span className="font-semibold"> Body: </span>
            <div className="text-sm mt-1 w-full">
              <p>
                Xin chào {room?.roomOwner?.lastName} {room?.roomOwner?.firstName}{" "},
              </p>
              <br />
              <div>
                <TextField
                  required
                  multiline
                  variant="standard"
                  rows={8}
                  color="tertiary"
                  placeholder="Nội dung"
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </div>
              <p>Trân trọng,</p>
              <p>
               {user?.lastName} {user?.firstName} 
              </p>
            </div>
          </div>
          <div className="flex mt-2 gap-2 justify-end py-2">
            <Button
              disabled={isProcessing || (alertFlag && alertType === "success")}
              type="submit"
              variant="contained"
              color="tertiary"
              sx={{ color: "#fff" }}
              startIcon={<SendRoundedIcon />}
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
                "Gửi Email"
              )}
            </Button>
          </div>
        </form>
      </div>
      <ConfirmModal open={open} handleModalClose={handleModalClose}>
        <h3 className="text-center">Gửi phản hồi</h3>
        <p className="text-center my-4">
          Bạn chắc chắn muốn gửi phản hồi?
        </p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <Button onClick={handleModalClose} color="error">
              Không
          </Button>

          <Button onClick={handleEmailSend} color="success" variant="contained">
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
  );
};

export default SendComplaint;
