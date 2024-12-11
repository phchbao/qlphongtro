import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createRentDetail, clearAlert } from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { getOwnerAllContracts } from "../../features/ownerUser/ownerUserSlice";
import { AlertToast, ConfirmModal, PageLoading } from "../../components";
import { Button, CircularProgress, TextField, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import createRentImage from "../../assets/images/createRentImage.svg";
import {
  dateFormatter,
  format,
  calculateTotalRent,
  calculateNumberOfMonths,
  calculateNextDueDate,
  calculateAddedDate,
} from "../../utils/valueFormatter";

const CreateRentDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { success, isProcessing, alertFlag, alertMsg, alertType } = useSelector(
    (state) => state.rentDetailOwner
  );

  const { allContracts, isLoading } = useSelector((state) => state.ownerUser);

  // get all real estate
  useEffect(() => {
    dispatch(getOwnerAllContracts());
  }, [dispatch]);

  const [contractForm, setContractFrom] = useState({
    lodger: "",
    room: "",
    rentAmount: "",
    contractTerm: "",
    startDate: "",
    lodgerName: "",
    electric: "",
    water: "",
    service:"",
  });

  // handle change in the form
  const handleChange = useCallback(
    (e) => {
      setContractFrom({ ...contractForm, [e.target.name]: e.target.value });
    },
    [contractForm]
  );

  // set rent amount to the price of the room when the room is selected
  useEffect(() => {
    if (contractForm.room) {
      setContractFrom({
        ...contractForm,
        lodger: allContracts?.find(
          (contract) => contract.room._id === contractForm.room
        ).lodger._id,
        rentAmount: allContracts?.find(
          (contract) => contract.room._id === contractForm.room
        ).rentAmount,
        startDate: allContracts?.find(
          (contract) => contract.room._id === contractForm.room
        ).startDate,
        contractTerm: allContracts?.find(
          (contract) => contract.room._id === contractForm.room
        ).contractTerm,
        lodgerName: allContracts
          ?.find(
            (contract) => contract.room._id === contractForm.room
          )
          .lodger.firstName.concat(
            " ",
            allContracts?.find(
              (contract) => contract.room._id === contractForm.room
            ).lodger.lastName
          ),
      });
    }
  }, [contractForm.room, allContracts, setContractFrom, contractForm]);

  // Redirect to all rent details page
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/rentDetail`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

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
    const { lodger, room, contractTerm, startDate, electric, water, service} = contractForm;
    setFormData({
      lodger,
      room,
      contractTerm,
      startDate,
      currentRentDate: {
        from: startDate,
        to: calculateAddedDate(contractTerm, startDate),
      },
      electric,
      water,
      service,
    });

    handleModalOpen();
  };

  const handleCreateRentDetail = useCallback(() => {
    dispatch(createRentDetail({ formData }));
    handleModalClose();
  }, [dispatch, formData, handleModalClose]);

  const handleElectricPriceChange = (event) => {
    const newElectricPrice = event.target.value;
    setContractFrom({ ...contractForm, electric: newElectricPrice });
  };

  const handleWaterPriceChange = (event) => {
    const newWaterPrice = event.target.value;
    setContractFrom({ ...contractForm, water: newWaterPrice });
  };

  const handleServicePriceChange = (event) => {
    const newServicePrice = event.target.value;
    setContractFrom({ ...contractForm, service: newServicePrice });
  };

  if (isLoading) return <PageLoading />;

  return (
    <main className="flex flex-col md:flex-row">
      <div className="mt-10 flex flex-col items-center md:ml-16 md:items-start">
        <div className="mb-6">
          <h3 className="font-heading font-bold">Tạo hóa đơn</h3>
        </div>

        <div className="">
          <form id="form" onSubmit={handleConfirmation}>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="mb-4">
                <h5 className="text-gray-700 mb-3">
                  <HomeWorkRoundedIcon /> Chọn tên hợp đồng
                </h5>
                <TextField
                  select
                  required
                  label="Phòng"
                  value={contractForm.room}
                  onChange={handleChange}
                  sx={{ width: "300px" }}
                  name="room"
                  color="tertiary"
                >
                  {allContracts?.map((contract) => (
                    <MenuItem
                      key={contract._id}
                      value={contract.room._id}
                      className=""
                    >
                      {contract.room.title}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h5 className="text-gray-700 mb-3">
                  <InfoRoundedIcon /> Chi tiết hợp đồng
                </h5>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <TextField
                    label="Đại diện bên thuê"
                    value={contractForm.lodgerName}
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />

                  <TextField
                    label="Bắt đầu ngày"
                    value={contractForm.startDate}
                    name="startDate"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />

                  <TextField
                    label="Thời hạn hợp đồng"
                    value={contractForm.contractTerm}
                    name="contractTerm"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />

                  <TextField
                    label="Tạm tính"
                    value={contractForm.rentAmount}
                    name="rentAmount"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />
                                    <TextField
                                      label="Số điện (kWh)"
                    value={contractForm.electric}
                    onChange={handleElectricPriceChange}
                    name="electric"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />
                                    <TextField
                    label="Số nước (m3)"
                    value={contractForm.water}
                    onChange={handleWaterPriceChange}
                    name="water"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />
                                    <TextField
                    label="Giá dịch vụ (wifi, rác..)"
                    value={contractForm.service}
                    onChange={handleServicePriceChange}
                    name="service"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />

                </div>
              </div>
            </div>
            <div className="text-center mt-4 mb-6">
              <Button
                disabled={isProcessing}
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
                  "TẠO"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <ConfirmModal open={open} handleModalClose={handleModalClose}>
            <h3 className="text-center">Tạo hóa đơn</h3>
            <p className="text-center my-4">
                Bạn chắc chắn chứ? Việc tạo chi tiết cho thuê không thể hoàn tác và chỉ có thể tạo mới khi chấm dứt hợp đồng
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

      <div className="mt-10 mb-6 md:mb-0 mx-14 self-center">
        <img src={createRentImage} alt="" />
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

export default CreateRentDetail;
