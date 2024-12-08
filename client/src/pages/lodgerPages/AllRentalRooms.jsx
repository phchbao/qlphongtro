import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllLodgerRentalRooms } from "../../features/roomLodger/roomLodgerSlice";
import { PageLoading, Footer } from "../../components";
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Avatar,
} from "@mui/material";
import { format } from "../../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const AllRentalRooms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allRentalRooms, isLoading } = useSelector(
    (state) => state.roomLodger
  );
  useEffect(() => {
    dispatch(getAllLodgerRentalRooms());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (allRentalRooms?.length === 0)
    return (
      <div className="mx-auto text-center mt-8">
        <h4 className="mb-4">Bạn chưa thuê phòng nào</h4>
        <Button
          onClick={() => navigate("/lodger")}
          variant="contained"
          sx={{ color: "#fff" }}
        >
          Xem tin
        </Button>
      </div>
    );
  return (
    <>
      <main className="flex flex-col mb-12 mt-8 md:items-start md:ml-10">
        <div className="flex flex-wrap gap-8 justify-center mx-4 md:justify-start md:mx-0">
          {allRentalRooms?.map((item) => {
            const {
              title,
              category,
              price,
              address,
              roomImages,
              roomOwner,
              slug,
            } = item?.room;
            return (
              <Card
                sx={{
                  width: 345,

                  bgcolor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "0 2px 5px 0 rgba(0,0,0,0.2)",
                  },
                  color: "#102a43",
                }}
                key={item._id}
              >
                <Link to={`/lodger/rental-rooms/${slug}`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      sx={{ maxHeight: 150 }}
                      image={roomImages[0]}
                      alt={title}
                    />
                    <CardContent>
                      <h4
                        className="mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-primaryDark duration-300 ease-in-out"
                        style={{ maxWidth: "31ch" }}
                      >
                        {title}
                      </h4>
                      <p className="text-sm text-gray-400">{category}</p>
                      <p className="font-semibold">
                        <span className="">{format(price)}</span>.VND/ tháng
                      </p>
                      <p className="text-base">
                        <LocationOnOutlinedIcon color="secondary" />{" "}
                        {address?.district}, {address?.province}
                      </p>
                    </CardContent>
                  </CardActionArea>
                </Link>
                <div className="flex p-2">
                  <div className="flex items-center gap-1">
                    <Avatar
                      src={roomOwner?.profileImage}
                      alt={roomOwner?.firstName}
                      sx={{ width: 36, height: 36 }}
                    />
                    <span className="font-semibold text-xs text-gray-600">
                      {roomOwner?.firstName} {roomOwner?.lastName}
                    </span>
                  </div>
                  <Link
                    to={`/lodger/owner-user/${roomOwner?.slug}`}
                    className="ml-auto"
                  >
                    <Button
                      size="small"
                      color="tertiary"
                      variant="outlined"
                      sx={{
                        color: "#0496b4",
                      }}
                    >
                      CHI TIẾT BÊN THUÊ
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllRentalRooms;
