import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getRoomDetail,
  deleteRoom,
  clearAlert,
} from "../../features/roomOwner/roomOwnerSlice";
import {
  PageLoading,
  Footer,
  ImageCarousal,
  ConfirmModal,
  AlertToast,
} from "../../components";
import { format, dateFormatter } from "../../utils/valueFormatter";
import { Button, CircularProgress } from "@mui/material";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import { Tooltip } from "@mui/material";

const PersonalRoomDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shareUrl = `${import.meta.env.VITE_APP_BASE_URL}/#/lodger/tro-so/${slug}`;
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Hiển thị thông báo tạm thời
      });
    } else {
      alert("Trình duyệt của bạn không hỗ trợ chức năng này");
    }
  }, [shareUrl]);

  useEffect(() => {
    dispatch(getRoomDetail({ slug }));
  }, [slug, dispatch]);

  const {
    room,
    isLoading,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    postSuccess,
  } = useSelector((store) => store.roomOwner);

  // Redirect to detail page of the room after successful contract creation
  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => {
        navigate(`/owner`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [postSuccess, navigate, slug]);

  //close the alert toast
  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //handel modal open and close state
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const handleDeleteRoom = useCallback(() => {
    dispatch(deleteRoom({ slug }));
    handleModalClose();
  }, [dispatch, slug, handleModalClose]);

  if (isLoading) return <PageLoading />;

  if (!room)
    return <h1 className="mt-6 text-center">Không tìm thấy phòng nào</h1>;

  return (
    <>
      <main className="mb-12 mt-10 mx-4 md:mx-12">
        <div className="flex flex-col gap-4 mx-auto">
          <h3 className="font-heading font-bold">Chi tiết phòng</h3>
          <section className="flex flex-col gap-12 rounded-md md:flex-row">
            <div className="w-full md:w-2/3">
              <ImageCarousal roomImages={room?.roomImages} />
            </div>
            <div className="flex flex-col rounded-md gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">{room?.title}</h3>
                <div>
                  <p className="font-roboto text-gray-500">
                    {room?.category}
                  </p>
                </div>
                <p className="-ml-1 text-base tracking-tight">
                  <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
                  {room?.address?.detailAddress}
                </p>
                <div className="">
                  <p className="font-robotoNormal text-xs font-semibold tracking-tight">
                    Đăng ngày: {dateFormatter(room?.createdAt)}
                  </p>
                  <p className="font-robotoNormal text-xs tracking-tight">
                    Mã phòng: {room?.roomId}
                  </p>
                </div>
              </div>
              <div className="">
                <div className="rounded-md">
                  <p className="font-roboto text-primaryDark leading-4 ">
                    Giá theo tháng
                  </p>
                  <span className="font-semibold text-lg text-primaryDark">
                    {format(room?.price)}.VND
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-center">
                <Tooltip
                  title={copySuccess ? "Đã sao chép!" : "Chia sẻ"}
                  placement="top"
                  arrow
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleShare}
                    startIcon={<ShareRoundedIcon />}
                  >
                    Chia sẻ
                  </Button>
                </Tooltip>
              </div>
              {/* Render the edit and create contract if the real estate room is available for rental */}
              {room?.status === true ? (
                <div className="flex flex-wrap gap-4 mt-2 text-center">
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ color: "#fff" }}
                    size="small"
                    onClick={() => {
                      navigate(`/owner/tro-so/update/${slug}`);
                    }}
                    startIcon={<BorderColorIcon />}
                  >
                    Cập nhật
                  </Button>
                  <Link
                    to={`/owner/contract/create`}
                    state={{
                      roomId: room?._id,
                      title: room?.title,
                      price: room?.price,
                      slug: slug,
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ color: "#fff" }}
                      size="small"
                      startIcon={<GavelIcon />}
                    >
                      Tạo hợp đồng
                    </Button>
                  </Link>
                  <Button
                    disabled={
                      isProcessing || (alertFlag && alertType === "success")
                    }
                    variant="contained"
                    color="error"
                    sx={{ color: "#fff" }}
                    size="small"
                    onClick={handleModalOpen}
                    startIcon={<DeleteForeverRoundedIcon />}
                  >
                    {isProcessing ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: "#fff",
                        }}
                      />
                    ) : (
                      "Xóa phòng"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="">
                  <Link to={`/owner/contract/${room?._id}/${slug}`}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ color: "#fff" }}
                      startIcon={<ArticleIcon />}
                    >
                      Xem hợp đồng
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
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
        <div>
          <ConfirmModal open={open} handleModalClose={handleModalClose}>
            <h3 className="text-center">Xác nhận xóa</h3>
            <p className="text-center my-4">
              Chắc chắn xóa? Việc xóa này không thể hoàn tác
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <Button onClick={handleModalClose} color="error">
                Không
              </Button>

              <Button
                onClick={handleDeleteRoom}
                color="success"
                variant="contained"
              >
                Có
              </Button>
            </div>
          </ConfirmModal>
        </div>
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

export default PersonalRoomDetail;
