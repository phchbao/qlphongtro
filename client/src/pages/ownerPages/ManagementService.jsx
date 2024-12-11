import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress, TextField } from "@mui/material";
import { updateService, clearAlert } from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { getOwnerAllContracts } from "../../features/ownerUser/ownerUserSlice";
import { AlertToast, PageLoading } from "../../components";

const ManagementService = () => {
  const dispatch = useDispatch();

  const { success, isProcessing, alertFlag, alertMsg, alertType } = useSelector(
    (state) => state.rentDetailOwner
  );
  const { allContracts, isLoading } = useSelector((state) => state.ownerUser);

  const [service, setService] = useState("");

  // Fetch all contracts on component mount
  useEffect(() => {
    dispatch(getOwnerAllContracts());
  }, [dispatch]);

  const handleServiceChange = useCallback((e) => {
    setService(e.target.value);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (service) {
      dispatch(updateService({ service }));
    }
  };

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  if (isLoading) return <PageLoading />;

  return (
    <main className="flex flex-col items-center mt-10">
      <h3 className="font-heading font-bold mb-6">Nhập giá dịch vụ</h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <TextField
          label="Giá dịch vụ mới (VNĐ/tháng)"
          value={service}
          onChange={handleServiceChange}
          type="number"
          sx={{ width: "300px", marginBottom: "20px" }}
          required
        />

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
        >
          {isProcessing ? (
            <CircularProgress
              size={26}
              sx={{
                color: "#fff",
              }}
            />
          ) : (
            "Cập nhật"
          )}
        </Button>
      </form>

      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleAlertClose}
      />
    </main>
  );
};

export default ManagementService;
