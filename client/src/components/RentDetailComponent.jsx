import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Avatar,
} from "@mui/material";
import {
  format,
  dateFormatter,
  calculateNextDueDate,
} from "../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const RentDetailComponent = ({
  _id,
  lodger,
  room,
  contractTerm,
  currentRentDate,
}) => {
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
    >
      <Link to={`/owner/rentDetail/${_id}/${room?.slug}`}>
        <CardActionArea>
          <CardMedia
            component="img"
            sx={{ maxHeight: 150 }}
            image={room?.roomImages[0]}
            alt={room?.title}
          />
          <CardContent>
            <h4
              className="mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap"
              style={{ maxWidth: "31ch" }}
            >
              {room?.title}
            </h4>

            <div>
              <p className="font-semibold">
                <span className="">{format(room?.price)}</span>.VND /
                month
              </p>
              <p className="">
                <LocationOnOutlinedIcon color="secondary" />{" "}
                {room?.address?.district},{" "}
                {room?.address?.province}
              </p>
            </div>
            <div className="mt-2">
              <p className="font-robotoNormal">
                <span className="font-medium">Ngày bắt đầu:</span>{" "}
                {dateFormatter(currentRentDate?.from)}
              </p>
              <p className="font-robotoNormal">
                <span className="font-medium">Ngày kết thúc:</span>{" "}
                {dateFormatter(calculateNextDueDate(currentRentDate?.to))}
              </p>
              <p className="font-robotoNormal">
                <span className="font-medium">Thời hạn hợp đồng:</span> {contractTerm}
              </p>
            </div>
          </CardContent>
        </CardActionArea>
      </Link>
      <div className="flex p-2">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 text-sm mr-2">Người thuê</span>
          <Avatar
            src={lodger?.profileImage}
            alt={lodger?.firstName}
            sx={{ width: 36, height: 36 }}
          />
          <span className="font-semibold text-xs text-gray-600">
            {lodger?.firstName} {lodger?.lastName}
          </span>
        </div>
        <Link className="ml-auto" to={`/owner/lodger-user/${lodger?.slug}`}>
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
};

export default RentDetailComponent;
