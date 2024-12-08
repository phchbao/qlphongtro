import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSingleRentDetailOwnerView,
  getAllPaymentHistory,
} from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  PageLoading,
  Footer,
  ImageCarousal,
  PaymentHistoryComponent,
} from "../../components";
import { CardActionArea, Avatar, Button } from "@mui/material";
import {
  dateFormatter,
  format,
  calculateTotalRent,
  calculateNumberOfMonths,
  calculateNextDueDate,
} from "../../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import moment from "moment";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import HistoryIcon from "@mui/icons-material/History";

const SingleRentDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rentDetailId } = useParams();

  const ref = useRef(null);

  const {
    isLoading,
    rentDetail,
    isRentPaid,
    allPaymentHistory,
    isProcessing,
    numberOfPages,
  } = useSelector((state) => state.rentDetailOwner);

  // state to store page for payment history
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getSingleRentDetailOwnerView({ rentDetailId }));
  }, [dispatch, rentDetailId]);

  // state to show payment history component
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  // function to handle page number change
  const handlePageChange = (event, value) => {
    setPage(value);
    dispatch(getAllPaymentHistory({ page: value, rentDetailId }));
  };

  // function to handle click on show payment history button
  const handleShowPayment = () => {
    dispatch(getAllPaymentHistory({ rentDetailId, page: 1 }));
    setShowPaymentHistory(true); // show payment history component
    setPage(1);
    ref.current.scrollIntoView({ behavior: "smooth" }); // scroll to payment history component on click smoothly
  };

  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return <h1 className="mt-6 text-center">Không tìm thấy chi tiết thuê</h1>;

  return (
    <>
      <main className="mb-12 mt-10 mx-4 md:mx-12">
        <h3 className="mb-4 font-heading font-bold">Chi tiết thuê</h3>
        <section className="flex flex-col gap-12 rounded-md md:flex-row">
          <div className="w-full md:w-2/3">
            <ImageCarousal
              roomImages={rentDetail?.room?.roomImages}
            />
          </div>
          <div className="">
            <div className="flex flex-col gap-2">
              <Link to={`/owner/tro-so/${rentDetail?.room?.slug}`}>
                <h3 className="font-semibold hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
                  {rentDetail?.room?.title}
                </h3>
              </Link>

              <p className="-ml-1 text-base tracking-tight">
                <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
                {rentDetail?.room?.address?.detailAddress}
              </p>
            </div>
            <div className="mt-4 text-primaryDark">
              <p className="font-roboto leading-4 ">Tiền thuê một tháng</p>
              <span className="font-semibold text-lg">
                {format(rentDetail?.room?.price)}.VND
              </span>
              </div>
            <div className="mt-4 text-primaryDark">
              <p className="font-roboto leading-4 ">Tiền điện</p>
              <span className="font-semibold text-lg">
                {format(calculateTotalRent(rentDetail?.electricPrice,rentDetail?.electric))} kWh
              </span>
            </div>
            <div className="mt-4 text-primaryDark">
              <p className="font-roboto leading-4 ">Tiền nước</p>
              <span className="font-semibold text-lg">
                {format(calculateTotalRent(rentDetail?.waterPrice,rentDetail?.water))} m3
              </span>
            </div>
            <div className="mt-4 text-primaryDark">
              <p className="font-roboto leading-4 ">Phí dịch vụ</p>
              <span className="font-semibold text-lg">
                {format(rentDetail?.service)}.VND
              </span>
            </div>
            <div className="mt-4">
              <p className="font-robotoNormal">
                <span className="font-medium">Thời hạn hợp đồng:</span>{" "}
                {rentDetail?.contractTerm} tháng
              </p>
              <p className="font-robotoNormal">
                <span className="font-medium">Ngày bắt đầu:</span>{" "}
                {moment(rentDetail?.currentRentDate.from).format("DD-MM-YYYY")}
              </p>
              <p className="font-robotoNormal">
                <span className="font-medium">Ngày kết thúc:</span>{" "}
                {
                  calculateNextDueDate(rentDetail?.currentRentDate.to)
                }
              </p>
              <p className="font-robotoNormal">
                <span className="font-medium">Trạng thái thanh toán</span>{" "}
                {isRentPaid === true ? (
                  <>
                    <DoneRoundedIcon color="success" /> Paid
                  </>
                ) : (
                  <>
                    <CloseRoundedIcon color="error" /> Not Paid
                  </>
                )}
              </p>

              {/*  If rent is not paid then show the button to send email and mark as paid */}
              {isRentPaid === false && (
                <div className="flex flex-row gap-8 mt-4">
                  <Button
                    variant="contained"
                    color="tertiary"
                    size="small"
                    sx={{ color: "#fff" }}
                    onClick={() =>
                      navigate(
                        `/owner/rentDetail/send-payment-email/${rentDetail?._id}`
                      )
                    }
                    startIcon={<MailOutlineIcon />}
                  >
                    Nhắc nhở
                  </Button>

                  <Link
                    to={`/owner/rentDetail/paymentHistory/${rentDetail?._id}/create`}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ color: "#fff" }}
                      startIcon={<PointOfSaleIcon />}
                    >
                    THANH TOÁN
                    </Button>
                  </Link>
                </div>
              )}
              <div className="mt-6">
                <Button
                  onClick={handleShowPayment}
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ color: "#fff" }}
                  startIcon={<HistoryIcon />}
                >
                  Xem lịch sử thanh toán
                </Button>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-8">
          <Link to={`/owner/lodger-user/${rentDetail?.lodger?.slug}`}>
            <CardActionArea sx={{ borderRadius: "0.375rem" }}>
              <div className="p-4 shadow-lg rounded-md">
                <div className="flex gap-2 items-center">
                  <h4 className="font-medium">Thông tin người thuê</h4>
                  <ContactsRoundedIcon color="secondary" />
                </div>
                <div className="flex mt-4 gap-2 items-center">
                  <Avatar
                    src={rentDetail?.lodger?.profileImage}
                    alt={(rentDetail?.lodger?.firstName).toUpperCase()}
                  />
                  <h5 className="leading-4 font-serif">
                    {rentDetail?.lodger?.firstName}{" "}
                    {rentDetail?.lodger?.lastName}
                  </h5>
                </div>
                <div className="flex mt-2 ml-1 gap-2 items-center">
                  <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                  <p className="ml-3">{rentDetail?.lodger?.phoneNumber}</p>
                </div>
                <div className="flex mt-2 ml-1 gap-2 items-center">
                  <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                  <p className="overflow-auto">{rentDetail?.lodger?.email}</p>
                </div>
              </div>
            </CardActionArea>
          </Link>
        </div>
        <div ref={ref}>
          {showPaymentHistory && (
            <PaymentHistoryComponent
              allPaymentHistory={allPaymentHistory}
              isProcessing={isProcessing}
              numberOfPages={numberOfPages}
              page={page}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SingleRentDetail;
