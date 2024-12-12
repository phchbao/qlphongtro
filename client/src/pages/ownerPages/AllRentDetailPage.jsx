import { useEffect, useState } from "react";
import { getAllRentDetailsOwnerView } from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { PageLoading, RentDetailComponent, Footer } from "../../components";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const AllRentDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allRentDetails, isLoading } = useSelector(
    (state) => state.rentDetailOwner
  );

  const [filterStatus, setFilterStatus] = useState("all"); // Trạng thái lọc

  useEffect(() => {
    dispatch(getAllRentDetailsOwnerView());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (allRentDetails?.length === 0)
    return (
      <div className="flex flex-col items-center h-screen mt-12 gap-4">
        <h1 className="text-center">Chưa có hóa đơn nào được tạo</h1>
        <Button
          variant="contained"
          onClick={() => navigate("/owner/rentDetail/create")}
          sx={{ color: "#fff" }}
          startIcon={<AddCircleOutlineIcon />}
        >
          Tạo hóa đơn
        </Button>
      </div>
    );

  // Lọc danh sách hóa đơn
  const filteredRentDetails = allRentDetails?.filter((detail) => {
    if (filterStatus === "paid") return detail.isRentPaid;
    if (filterStatus === "unpaid") return !detail.isRentPaid;
    return true; // "all"
  });

  return (
    <>
      <main className="flex flex-col mb-12 mt-6 md:items-start md:ml-10">
        <div className="self-center md:self-start">
          <Button
            variant="contained"
            onClick={() => navigate("/owner/rentDetail/create")}
            sx={{ color: "#fff" }}
            size="small"
            startIcon={<AddCircleOutlineIcon />}
          >
            Tạo hóa đơn
          </Button>
        </div>
        <div className="self-center md:self-start mb-4">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button
              variant={filterStatus === "all" ? "contained" : "outlined"}
              onClick={() => setFilterStatus("all")}
            >
              Tất cả
            </Button>
            <Button
              variant={filterStatus === "paid" ? "contained" : "outlined"}
              onClick={() => setFilterStatus("paid")}
            >
              Đã thanh toán
            </Button>
            <Button
              variant={filterStatus === "unpaid" ? "contained" : "outlined"}
              onClick={() => setFilterStatus("unpaid")}
            >
              Chưa thanh toán
            </Button>
          </ButtonGroup>
        </div>
        <h3 className="my-4 font-heading font-bold text-center">Hóa đơn</h3>
        <div className="flex flex-wrap gap-8 justify-center mx-4 md:justify-start md:mx-0">
          {filteredRentDetails?.map((rentDetail) => (
            <RentDetailComponent key={rentDetail._id} {...rentDetail} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllRentDetailPage;
