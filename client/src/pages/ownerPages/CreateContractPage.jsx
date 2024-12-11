import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllContacts,
  createContract,
  clearAlert,
} from "../../features/ownerUser/ownerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, AlertToast, ConfirmModal } from "../../components";
import { Button, CircularProgress, TextField, MenuItem, Autocomplete } from "@mui/material";
import moment from "moment";
import contractImage from "../../assets/images/createContract.svg";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import axiosFetch from "../../utils/axiosCreate";

const CreateContractPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const province = useLocation();
  const { roomId, title, price, slug } = province?.state; // state is passed from the previous page

  const { contacts, isProcessing, success, alertFlag, alertMsg, alertType } =
    useSelector((state) => state.ownerUser);

  useEffect(() => {
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const [contractForm, setContractFrom] = useState({
    lodger: "",
    room: roomId,
    rentAmount: price,
    contractTerm: "",
  });

  const [date, setDate] = useState(null);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === "contractTerm") {
        // Đảm bảo giá trị contractTerm nằm trong khoảng 1-24
        const numValue = Math.max(1, Math.min(24, Number(value)));
        setContractFrom({ ...contractForm, [name]: numValue });
      } else {
        setContractFrom({ ...contractForm, [name]: value });
      }
    },
    [contractForm]
  );

  const contractTerms = [
    "1 tháng",
    "3 tháng",
    "6 tháng",
    "12 tháng",
  ];

  // Redirect to detail page of the room after successful contract creation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/tro-so/${slug}`);
      }, 3000);
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

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formData, setFormData] = useState({});
  const handleConfirmation = (e) => {
    e.preventDefault();
    const { lodger, room, rentAmount, contractTerm } = contractForm;
    setFormData({
      lodger,
      room,
      rentAmount,
      contractTerm,
      startDate: moment(date).format("YYYY-MM").concat("-01"),
    });

    handleModalOpen();
  };

  const handleCreateContract = useCallback(() => {
    dispatch(createContract({ formData }));
    handleModalClose();
  }, [dispatch, formData, handleModalClose]);

  return (
    <main className="flex flex-row mb-8 md:mb-0">
      <div className="mt-10 flex flex-col items-center md:ml-14 md:items-start">
        <div className="mb-6">
          <h3 className="font-heading font-bold">Tạo hợp đồng</h3>
        </div>
        <div className="mb-4 flex items-center">
          <h5 className="font-semibold">Tên phòng: </h5>
          <h5 className="ml-2">{title}</h5>
        </div>
        <div className="">
          <form id="form" onSubmit={handleConfirmation}>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Autocomplete
  options={contacts || []}
  getOptionLabel={(option) => option.email || ""} 
  value={contacts?.map((user) => user._id === contractForm.lodger ? user : null).find(Boolean) || null} // Dùng map và tìm giá trị hợp lệ
  onChange={(event, newValue) => {
    handleChange({
      target: { name: "lodger", value: newValue ? newValue._id : "" },
    });
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      required
      label="Người thuê"
      sx={{ width: "300px" }}
      color="tertiary"
    />
  )}
/>

              <DatePicker
                label="Bắt đầu ngày"
                value={date}
                views={["year", "month"]}
                handleChange={useCallback(
                  (date) => {
                    setDate(date);
                  },
                  [setDate]
                )}
              />

<TextField
  required
  label="Thời hạn hợp đồng (tháng)"
  type="number"
  inputProps={{
    min: 1,
    max: 24,
    style: { textAlign: "center" },
  }}
  value={contractForm.contractTerm}
  onChange={handleChange}
  sx={{ width: "250px" }}
  name="contractTerm"
  color="tertiary"
/>
<div className="flex gap-2 mt-2">
  <Button
    variant="outlined"
    size="small"
    disabled={contractForm.contractTerm <= 1}
    onClick={() =>
      setContractFrom({
        ...contractForm,
        contractTerm: contractForm.contractTerm - 1,
      })
    }
  >
    -
  </Button>
  <Button
    variant="outlined"
    size="small"
    disabled={contractForm.contractTerm >= 24}
    onClick={() =>
      setContractFrom({
        ...contractForm,
        contractTerm: contractForm.contractTerm + 1,
      })
    }
  >
    +
  </Button>
</div>

              <TextField
                label="Tạm tính"
                value={contractForm.rentAmount}
                name="rentAmount"
                color="tertiary"
                sx={{ width: "300px" }}
                disabled
              />
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
                startIcon={<BorderColorRoundedIcon />}
              >
                {isProcessing ? (
                  <CircularProgress
                    size={26}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  "Tạo"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <ConfirmModal open={open} handleModalClose={handleModalClose}>
            <h3 className="text-center">Xác nhận tạo hợp đồng?</h3>
            <p className="text-center my-4">
                Chắc chắn tạo hợp đồng? Một khi bạn đã tạo hợp đồng, bạn không thể chỉnh sửa mà chỉ có thể xóa nó. Hợp đồng sẽ được gửi cho người thuê để xem xét
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <Button onClick={handleModalClose} color="error">
                Không
              </Button>

              <Button
                onClick={handleCreateContract}
                color="success"
                variant="contained"
              >
                Có
              </Button>
            </div>
          </ConfirmModal>
        </div>
      </div>

      <div className="hidden md:block mx-auto mt-10 mb-6 md:mb-0">
        <img src={contractImage} alt="" />
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

export default CreateContractPage;
