import { useState, useCallback, useEffect } from "react";
import { FormTextField, FormSelectField, AlertToast, CheckboxField} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  postRoom,
  clearAlert,
} from "../../features/roomOwner/roomOwnerSlice";

import postRoomImg from "../../assets/images/postRoomImg.svg";
import postRoomImg2 from "../../assets/images/postRoomImg2.svg";
import postRoomImg3 from "../../assets/images/postRoomImg3.svg";

import {
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { provinceNames } from "../../utils/provinceNames";
import districtsByProvince from "../../utils/districtsByProvince.json";
import InfoIcon from "@mui/icons-material/Info";
import BungalowIcon from "@mui/icons-material/Bungalow";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PermMediaIcon from "@mui/icons-material/PermMedia";

const PostRoom = () => {
  const { alertFlag, alertMsg, alertType, isLoading, postSuccess, room } =
    useSelector((store) => store.roomOwner);

  const initialFormValues = {
    title: "",
    price: "",
    description: "",
    province: "",
    district: "",
    detailAddress: "",
    category: "",
    area: "",
    beds: "",
    amenities: "",
  };

  const [values, setFormValues] = useState(initialFormValues);
  const [districts, setDistricts] = useState([]);
  const [images, setImages] = useState(null);

  const handleImagesChange = (e) => {
    const arr = Array.from(e.target.files);
    setImages(arr.map((file) => URL.createObjectURL(file)));
  };

  const previewImage = () => {
    if (images) {
      return images.map((image, index) => {
        return (
          <div className="p-2" key={index}>
            <img src={image} alt="profilePreview" className="h-24 md:h-28" />
          </div>
        );
      });
    }
  };

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);
    dispatch(postRoom({ formData }));
  };

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const navigate = useNavigate();

  // Redirect to detail page of the room after successful posting
  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => {
        navigate(`/owner/tro-so/${room?.slug}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [postSuccess, navigate, room]);

  useEffect(() => {
    // Lấy danh sách huyện tương ứng với tỉnh được chọn từ tệp JSON
    const selectedProvinceDistricts = districtsByProvince[values.province];
    setDistricts(selectedProvinceDistricts || []); // Cập nhật danh sách huyện
    // Đặt giá trị huyện về rỗng khi tỉnh thay đổi
    setFormValues(prevValues => ({...prevValues, district: ""}));
  }, [values.province]);

  return (
    <div>
      <main className="px-6 h-full mt-7">
        <div className="flex lg:justify-between justify-center flex-wrap h-full g-6">
          <div className="lg:w-5/12 md:w-8/12 mb-12">
            <form onSubmit={handleSubmit} id="form">
              <div className="flex flex-col justify-center items-center mt-3 mb-4">
                <h3 className="font-heading font-bold">Đăng bài cho thuê </h3>
                <p className="text-gray-400 text-sm">
                  Vui lòng điền đầy đủ thông tin
                </p>
              </div>
              <div className="flex flex-wrap flex-col gap-2 ml-5">
                <div className="flex flex-col gap-4 my-2">
                  <h5 className="mb-1">
                    <InfoIcon /> Thông tin cơ bản
                  </h5>
                  <FormTextField
                    label="Tên"
                    name="title"
                    type={"text"}
                    value={values.title}
                    handleChange={handleChange}
                    autoFocus={true}
                  />
                  <TextField
                    label="Mô tả"
                    required
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
                    required
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
                    required
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
                    required
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
                    label="Tỉnh"
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
                <div className="flex flex-col my-2">
                  <h5>
                    <PermMediaIcon /> Ảnh
                  </h5>
                  <div className="flex flex-col justify-center pb-2">
                    <label
                      htmlFor="formFileMultiple"
                      className="form-label inline-block mb-2 text-gray-500 cursor-pointer font-robotoNormal"
                    >
                    </label>

                    <input
                      required
                      name="roomImages"
                      className="form-control block font-robotoNormal w-full px-3 py-1.5 text-base font-normal border border-solid border-gray-300 rounded cursor-pointer focus:border-tertiary focus:outline-none"
                      type="file"
                      id="formFileMultiple"
                      multiple
                      onChange={handleImagesChange}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Hỗ trợ JPG, JPEG, PNG hoặc GIF (Tối đa 3.5MB)
                    </p>
                  </div>
                  <div className="flex flex-wrap self-center border mt-2">
                    {previewImage()}
                  </div>
                </div>
              </div>

              <div className="text-center mt-2">
                <Button
                  disabled={isLoading || (alertFlag && alertType === "success")}
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
                  {isLoading ? (
                    <CircularProgress
                      size={26}
                      sx={{
                        color: "#fff",
                      }}
                    />
                  ) : (
                    "ĐĂNG"
                  )}
                </Button>
              </div>
            </form>
          </div>
          <div className="hidden grow-0 shrink-1 md:shrink-0 basis-auto w-5/12 mb-12 lg:block">
            <img
              src={postRoomImg}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
            <img
              src={postRoomImg2}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
            <img
              src={postRoomImg3}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
          </div>
        </div>
      </main>

      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
    </div>
  );
};

export default PostRoom;
