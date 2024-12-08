import { useState, useCallback, useEffect } from "react";
import { FormTextField, FormSelectField, CheckboxField } from "..";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { provinceNames } from "../../utils/provinceNames";
import districtsByProvince from "../../utils/districtsByProvince.json";
import InfoIcon from "@mui/icons-material/Info";
import BungalowIcon from "@mui/icons-material/Bungalow";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircularProgress from "@mui/material/CircularProgress";

const UpdateRoomForm = ({
  title,
  description,
  price,
  category,
  area,
  beds,
  amenities,
  address,
  isProcessing,
}) => {
  const initialFormValues = {
    price,
    description,
    province: address?.province,
    district: address?.district,
    detailAddress: address?.detailAddress,
    category,
    area,
    beds,
    amenities,
  };
  const [values, setFormValues] = useState(initialFormValues);
  const [districts, setDistricts] = useState([]);
  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  useEffect(() => {
    // Lấy danh sách huyện tương ứng với tỉnh được chọn từ tệp JSON
    const selectedProvinceDistricts = districtsByProvince[values.province];
    setDistricts(selectedProvinceDistricts || []); // Cập nhật danh sách huyện
    // Đặt giá trị huyện về rỗng khi tỉnh thay đổi
    setFormValues(prevValues => ({...prevValues, district: ""}));
  }, [values.province]);

  return (
    <>
      <div className="flex flex-wrap flex-col gap-2 ml-5">
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <InfoIcon /> Thông tin cơ bản
          </h5>
          <TextField label="Tên" color="tertiary" disabled value={title} />
          <TextField
            label="Mô tả"
            multiline
            rows={4}
            color="tertiary"
            placeholder="Mô tả phòng (không dài quá 300 kí tự)"
            name="description"
            value={values.description}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <BungalowIcon /> Thông tin chi tiết
          </h5>
          <TextField
            label="Giá"
            name="price"
            type="number"
            placeholder="Nhập giá phòng..."
            value={values.price}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">.VND</InputAdornment>
              ),
            }}
          />
          <FormSelectField
            label="Loại phòng"
            name="category"
            options={["Chung cư mini", "Truyền thống", "Sleepbox", "KTX", "Homestay"]}
            value={values.category}
            handleChange={handleChange}
          />

          <TextField
            label="Diện tích"
            name="area"
            type="number"
            placeholder="Diện tích phòng"
            value={values.area}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">m2</InputAdornment>
              ),
            }}
          />
          <TextField
            label="Giường"
            name="beds"
            type="number"
            placeholder="Số giường"
            value={values.beds}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">giường</InputAdornment>
              ),
            }}
          />
<CheckboxField
  label="Tiện nghi"
  name="amenities"
  options={["WiFi ", "Điều hòa ", "Nhà bếp ", "Gác "]}
  value={values.amenities}
  handleChange={handleChange}
/>
        </div>
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <LocationOnIcon /> Địa chỉ
          </h5>
          <FormSelectField
            label="Địa chỉ"
            name="province"
            options={provinceNames}
            value={values.province}
            handleChange={handleChange}
          />
<FormSelectField
  label="Quận/ huyện/ thị xã/ thành phố trực thuộc tỉnh (thành phố)"
  name="district"
  options={districts}
  value={values.district}
  handleChange={handleChange}
/>
          <FormTextField
            label="Địa chỉ chi tiết"
            name="detailAddress"
            type={"text"}
            value={values.detailAddress}
            handleChange={handleChange}
          />
        </div>
      </div>

      <div className="text-center mt-2">
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
            width: "25%",
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
            "CẬP NHẬT"
          )}
        </Button>
      </div>
    </>
  );
};

export default UpdateRoomForm;
