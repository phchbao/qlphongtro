import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress, TextField } from "@mui/material";
import { updateWaterPrice, clearAlert } from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { getOwnerAllContracts } from "../../features/ownerUser/ownerUserSlice";
import { AlertToast, PageLoading } from "../../components";

const ManagementWater = () => {
  const dispatch = useDispatch();

  const { success, isProcessing, alertFlag, alertMsg, alertType } = useSelector(
    (state) => state.rentDetailOwner
  );
  const { allContracts, isLoading } = useSelector((state) => state.ownerUser);

  const [waterPrice, setWaterPrice] = useState("");

  // Fetch all contracts on component mount
  useEffect(() => {
    dispatch(getOwnerAllContracts());
  }, [dispatch]);

  const handleWaterPriceChange = useCallback((e) => {
    setWaterPrice(e.target.value);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (waterPrice) {
      dispatch(updateWaterPrice({ waterPrice }));
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
      <h3 className="font-heading font-bold mb-6">Nhập giá nước</h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <TextField
          label="Giá nước mới (VNĐ/m³)"
          value={waterPrice}
          onChange={handleWaterPriceChange}
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

export default ManagementWater;