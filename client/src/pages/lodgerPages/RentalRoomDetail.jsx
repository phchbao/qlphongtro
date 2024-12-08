import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSingleRoom } from "../../features/roomLodger/roomLodgerSlice";
import { PageLoading, Footer, ImageCarousal } from "../../components";
import { format, dateFormatter } from "../../utils/valueFormatter";
import { CardActionArea, Avatar, Button } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MailIcon from "@mui/icons-material/Mail";

const RentalRoomDetail = () => {
  const { room, isLoading } = useSelector(
    (state) => state.roomLodger
  );

  const dispatch = useDispatch();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getSingleRoom({ slug }));
  }, [slug, dispatch]);

  if (isLoading) return <PageLoading />;

  if (!room)
    return <h1 className="mt-6 text-center">Không tìm thấy phòng nào</h1>;

  return (
    <>
      <main className="mb-12 mt-10 mx-4 md:mx-12">
        <div className="flex flex-col gap-4 mx-auto">
          <h3 className="font-heading font-bold">Chi tiết phòng</h3>
          <section className="flex flex-col gap-12 rounded-md md:flex-row">
            <div className="w-full md:w-2/3">
              <ImageCarousal roomImages={room?.roomImages} />
            </div>
            <div className="flex flex-col rounded-md gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">{room?.title}</h3>
                <div>
                  <p className="font-roboto text-gray-500">
                    {room?.category}
                  </p>
                </div>
                <p className="-ml-1 text-base tracking-tight">
                  <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
                  {room?.address?.detailAddress}
                </p>
                <div className="">
                  <p className="font-robotoNormal text-xs font-semibold tracking-tight">
                    Đăng ngày: {dateFormatter(room?.createdAt)}
                  </p>
                  <p className="font-robotoNormal text-xs tracking-tight">
                    Mã phòng: {room?.roomId}
                  </p>
                </div>
              </div>
              <div className="">
                <div className="rounded-md">
                  <p className="font-roboto text-primaryDark leading-4 ">
                    Giá theo tháng
                  </p>
                  <span className="font-semibold text-lg text-primaryDark">
                    {format(room?.price)}.VND
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <Link to={`/lodger/contract/${room?._id}/${slug}`}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ color: "#fff" }}
                    startIcon={<ArticleIcon />}
                  >
                    Xem hợp đồng
                  </Button>
                </Link>
                <Link
                  to={`/lodger/rentDetail/${room?._id + "/" + slug}`}
                  state={{ roomId: room?._id }}
                >
                  <Button
                    variant="contained"
                    color="tertiary"
                    size="small"
                    sx={{ color: "#fff" }}
                    startIcon={<MapsHomeWorkIcon />}
                  >
                    Chi tiết thuê
                  </Button>
                </Link>
                <Link to={`/lodger/send-complaint/${slug}`}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ color: "#fff" }}
                    startIcon={<MailIcon />}
                  >
                    Góp ý
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          <article className="mt-2">
            <Link to={`/lodger/owner-user/${room?.roomOwner?.slug}`}>
              <CardActionArea sx={{ borderRadius: "6px" }}>
                <div className="shadow-lg rounded-md p-4">
                  <div className="flex gap-2 items-center">
                    <h4 className="font-medium">Thông tin liên hệ</h4>
                    <ContactsRoundedIcon color="secondary" />
                  </div>
                  <div className="flex mt-4 gap-2 items-center">
                    <Avatar
                      src={room?.roomOwner?.profileImage}
                      alt={(room?.roomOwner?.firstName).toUpperCase()}
                    />
                    <p className="leading-4">
                      {room?.roomOwner?.firstName}{" "}
                      {room?.roomOwner?.lastName}
                    </p>
                  </div>
                  <div className="flex mt-2 ml-1 gap-2 items-center">
                    <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                    <p className="ml-3">
                      {room?.roomOwner?.phoneNumber}
                    </p>
                  </div>
                  <div className="flex mt-2 ml-1 gap-2 items-center">
                    <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                    <p className="overflow-auto">
                      {room?.roomOwner?.email}
                    </p>
                  </div>
                </div>
              </CardActionArea>
            </Link>
          </article>
          <div className="">
            <h3 className="font-semibold p-3">Mô tả</h3>
            <hr className="w-3/4 ml-3 border-t-2 rounded-md" />
            <p className="text-lg p-3 tracking-normal">
              {room?.description}
            </p>
          </div>
          <div className="">
            <h3 className="font-semibold p-3">Tổng quan</h3>
            <hr className="w-3/4 ml-3 border-t-2 rounded-md" />
            <div className="flex flex-wrap">
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <SquareFootRoundedIcon sx={{ color: "#738FA7" }} />
                </span>
                <span className="font-semibold">Diện tích phòng</span>
                <p className="">{format(room?.area)} m2</p>
              </div>
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <HorizontalSplitRoundedIcon />
                </span>
                <span className="font-semibold">
                  Số {room?.beds > 1 ? "giường" : "giường"}
                </span>
                <p className="">{format(room?.beds)} </p>
              </div>
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <ExploreRoundedIcon sx={{ color: "#29b46e" }} />
                </span>
                <span className="font-semibold"> Tiện nghi </span>
                <p className="">{room?.amenities}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RentalRoomDetail;
