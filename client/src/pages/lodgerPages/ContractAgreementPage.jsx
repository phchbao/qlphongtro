import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getContractWithID, clearAlert, approveContract } from '../../features/lodgerUser/lodgerUserSlice';
import { PageLoading, AlertToast, ConfirmModal } from '../../components';
import { Button, CircularProgress } from '@mui/material';
import contractApprovedImg from '../../assets/images/contractApproved.svg';

const ContractAgreementPage = () => {
  const { contractId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getContractWithID({ contractId }));
  }, [dispatch, contractId]);

  const { contractDetail, isLoading, isProcessing, alertFlag, alertType, alertMsg } = useSelector((state) => state.lodgerUser);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const handleApproveContract = useCallback(() => {
    dispatch(approveContract({ contractId }));
    handleModalClose();
  }, [dispatch, contractId, handleModalClose]);

  const calculateTotalRent = useCallback(() => {
    const { contractTerm, rentAmount } = contractDetail;
      return rentAmount * contractTerm;
  }, [contractDetail]);

  if (isLoading) return <PageLoading />;

  if (!contractDetail) return <div className="flex justify-center items-start h-screen mt-10"><h1>Contract Does not Exists!</h1></div>;

  return (
    <main className="mb-12">
      {contractDetail?.status === 'Pending' && (
        <>
          {/* Hiển thị trang Google Docs */}
          <iframe src="https://docs.google.com/document/d/1uigw6XCcfeeSg8poMfVRegjfoGhhFsdUqo7Lf9uL_6U/preview" width="100%" height="600"></iframe>

          <div className="flex justify-center mt-6">
            <Button
              onClick={handleModalOpen}
              variant="contained"
              size="large"
              color="tertiary"
              sx={{ color: '#fff' }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <CircularProgress
                  size={26}
                  sx={{
                    color: '#fff',
                  }}
                />
              ) : (
                'Chấp nhận hợp đồng'
              )}
            </Button>
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


        </>
      )}

      {contractDetail?.status === 'Active' && (
        <div className="flex flex-col items-center mt-10 gap-2">
          <h1 className="text-center">Hợp đồng đã được xác nhận</h1>
          <div className="w-56">
            <img src={contractApprovedImg} className="w-full" alt="login banner" />
          </div>
        </div>
      )}

      <div>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">Xác nhận hợp đồng?</h3>
          <p className="text-center my-4">Chắc chắn rằng bạn đã đọc kĩ các điều khoản trước khi đồng ý? Hai bên điều phải tuân theo những điều khoản một khi hợp đồng được thiết lập.</p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="error">Không</Button>
            <Button onClick={handleApproveContract} color="success" variant="contained">Có</Button>
          </div>
        </ConfirmModal>
      </div>

      <AlertToast alertFlag={alertFlag} alertMsg={alertMsg} alertType={alertType} handleClose={handleAlertClose} />
    </main>
  );
};

export default ContractAgreementPage;
