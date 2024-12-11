import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import {
  getSingleRentDetailOwnerView,
  createPaymentHistory,
  clearAlert,
} from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { AlertToast, ConfirmModal, PageLoading } from "../../components";
import { Button, CircularProgress, TextField, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import {
  dateFormatter,
  format,
  calculateTotalRent,
  calculateNumberOfMonths,
  calculateNextDueDate,
  calculateAddedDate,
} from "../../utils/valueFormatter";
import paymentImg from "../../assets/images/payment.svg";

const CreatePaymentHistory = () => {
  const { rentDetailId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    rentDetail,
    success,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    isLoading,
  } = useSelector((state) => state.rentDetailOwner);

  useEffect(() => {
    dispatch(getSingleRentDetailOwnerView({ rentDetailId }));
  }, [dispatch, rentDetailId]);

  const paymentMethodOptions = ["Trực tiếp", "Chuyển khoản"];

  const [paymentForm, setPaymentFrom] = useState({
    paymentMethod: "",
  });

  // handle change in the form
  const handleChange = useCallback(
    (e) => {
      setPaymentFrom({ ...paymentForm, [e.target.name]: e.target.value });
    },
    [paymentForm]
  );

  // Redirect to all rent details page
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(
          `/owner/rentDetail/${rentDetailId}/${rentDetail?.room.slug}`
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, rentDetailId, rentDetail?.room.slug]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //modal state and handlers
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formData, setFormData] = useState({});
  const handleConfirmation = (e) => {
    e.preventDefault();
    const { paymentMethod } = paymentForm;
    const nextDueDate = calculateNextDueDate(rentDetail?.currentRentDate?.to);
    setFormData({
      paymentMethod,
      rentDetail: rentDetailId,
      amountPaid: 
        rentDetail?.room?.price
       + calculateTotalRent(
        rentDetail?.electric,
        rentDetail?.electricPrice
      ) +calculateTotalRent(
        rentDetail?.water,
        rentDetail?.waterPrice
      )
      + rentDetail?.service,
      currentRentDate: {
        from: rentDetail?.currentRentDate?.from,
        to: rentDetail?.currentRentDate?.to,
      },
      nextRentDueDate: {
        from: nextDueDate,
        to: calculateAddedDate(rentDetail?.contractTerm, nextDueDate),
      },
    });

    handleModalOpen();
  };

  const handleCreateRentDetail = useCallback(() => {
    dispatch(createPaymentHistory({ formData }));
    handleModalClose();
  }, [dispatch, formData, handleModalClose]);

  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return <h1 className="mt-6 text-center">Không tìm thấy hóa đơn</h1>;

  return (
    <main className="flex mt-14 flex-row justify-center">
      <div className="flex flex-col items-center md:ml-14 md:items-start">
        <div className="mb-6 text-center md:text-start">
          <h3 className="font-heading font-bold">Xác nhận thanh toán</h3>
          <h4 className="font-robotoNormal mt-2">
            <HomeWorkRoundedIcon /> {rentDetail?.room.title}
          </h4>
        </div>

        <div className="">
          <form id="form" onSubmit={handleConfirmation}>
            <div className="flex flex-col gap-4 justify-center md:justify-start mt-4">
              <div className="mb-3">
                <h5 className="text-gray-700">
                  <DateRangeRoundedIcon />{" "}
                  {dateFormatter(rentDetail?.currentRentDate.from)} -{" "}
                  {dateFormatter(rentDetail?.currentRentDate.to)}
                </h5>
              </div>
              <div className="flex mb-3 gap-4">
                <h5 className="text-gray-700">
                  Tổng tiền trọ: 
                      
                     " " {rentDetail?.room.price}
                    
                  .VND
                </h5>

              </div>
              <div className="flex mb-3 gap-4">
                <h5 className="text-gray-700">
                  Tiền điện: {format(
                    calculateTotalRent(
                      rentDetail?.electricPrice,
                      rentDetail?.electric
                    )
                  )}.VND
                </h5>
              </div>
              <div className="flex mb-3 gap-4">
                <h5 className="text-gray-700">
                  Tiền nước: {format(
                    calculateTotalRent(
                      rentDetail?.waterPrice,
                      rentDetail?.water
                    )
                  )}.VND
                </h5>
              </div>
              <div className="flex mb-3 gap-4">
                <h5 className="text-gray-700">
                  Phí dịch vụ: {format(rentDetail?.service)}.VND
                </h5>
              </div>
              
              <div className="mb-4">
                <h5 className="text-gray-700 mb-3">
                  <InfoRoundedIcon /> Chọn phương thức thanh toán
                </h5>
                <TextField
                  select
                  required
                  label="Phương thức thanh toán"
                  value={paymentForm.paymentMethod}
                  onChange={handleChange}
                  sx={{ width: "250px" }}
                  name="paymentMethod"
                  color="tertiary"
                >
                  {paymentMethodOptions?.map((value, index) => (
                    <MenuItem key={index} value={value} className="">
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
            <div className="text-center mt-4 mb-6">
              <Button
                disabled={
                  isProcessing || (alertFlag && alertType === "success")
                }
                type="submit"
                variant="contained"
                size="large"
                color="primary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                {isProcessing ? (
                  <CircularProgress
                    size={26}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <ConfirmModal open={open} handleModalClose={handleModalClose}>
            <h3 className="text-center">Xác nhận thanh toán</h3>
            <p className="text-center my-4">
              Bạn chắc chắn đã nhận khoản thanh toán này? Việc này không thể hoàn tác.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <Button onClick={handleModalClose} color="error">
                Không
              </Button>

              <Button
                onClick={handleCreateRentDetail}
                color="success"
                variant="contained"
              >
                Có
              </Button>
            </div>
          </ConfirmModal>
        </div>
      </div>
      <div className="hidden pl-4 self-center md:block">
        <img src={paymentImg} alt="" />
      </div>
      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleAlertClose}
      />
    </main>
  );
};

export default CreatePaymentHistory;
