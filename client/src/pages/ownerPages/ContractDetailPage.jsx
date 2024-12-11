import React from 'react';
import { useState, useEffect, useCallback } from "react";
import { getContractOwnerView, clearAlert, deleteContract } from "../../features/ownerUser/ownerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { PageLoading, AlertToast, ConfirmModal } from "../../components";
import { Button, CircularProgress } from "@mui/material";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";

const ContractDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const {
    contractDetail,
    isLoading,
    isProcessing,
    alertFlag,
    alertType,
    alertMsg,
    success,
  } = useSelector((state) => state.ownerUser);

  useEffect(() => {
    dispatch(getContractOwnerView({ roomId }));
  }, [dispatch, roomId]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/tro-so/${contractDetail?.room?.slug}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, contractDetail?.room?.slug]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const handleDeleteContract = useCallback(() => {
    dispatch(deleteContract({ contractId: contractDetail?._id }));
    handleModalClose();
  }, [dispatch, contractDetail?._id, handleModalClose]);

  if (isLoading) return <PageLoading />;

  if (!contractDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Contract Does not Exist!</h1>
      </div>
    );

  return (
    <main className="mb-12">
      <div>
        {/* Hiển thị trang Google Docs */}
        <iframe src="https://docs.google.com/document/d/1uigw6XCcfeeSg8poMfVRegjfoGhhFsdUqo7Lf9uL_6U/preview" width="100%" height="600"></iframe>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onClick={handleModalOpen}
          variant="contained"
          size="medium"
          color="error"
          sx={{ color: "#fff" }}
          disabled={isProcessing || (alertFlag && alertType === "success")}
          startIcon={<RemoveCircleRoundedIcon />}
        >
          {isProcessing ? (
            <CircularProgress
              size={26}
              sx={{
                color: "#fff",
              }}
            />
          ) : (
            "Chấm dứt hợp đồng"
          )}
        </Button>
        {/* Thêm nút tải tệp Google Doc xuống */}
        <a href="https://docs.google.com/document/d/1uigw6XCcfeeSg8poMfVRegjfoGhhFsdUqo7Lf9uL_6U/export?format=docx" download>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            sx={{ color: "#fff", marginLeft: "10px" }}
          >
            Tải xuống
          </Button>
        </a>
      </div>

      <div>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">Chấm dứt hợp đồng</h3>
          <p className="text-center my-4">
            Xác nhận hủy? Đảm bảo rằng bạn đã liên hệ với người thuê trước để thảo luận về vấn đề này.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="warning">
              Không
            </Button>

            <Button
              onClick={handleDeleteContract}
              color="error"
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
  );
};

export default ContractDetailPage;
