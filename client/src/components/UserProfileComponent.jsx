import { useState, useCallback } from "react";
import { FormTextField } from "../components";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ageCalculator } from "../utils/valueFormatter";

const UserProfileComponent = ({
  firstName,
  lastName,
  email,
  address,
  phoneNumber,
  dateOfBirth,
  gender,
  isProcessing,
}) => {
  const [values, setFormValues] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    address: address,
    phoneNumber: phoneNumber,
    dateOfBirth: dateOfBirth,
    gender: gender,
  });

  const formatDate = (value) => {
    // Loại bỏ các ký tự không phải số
    const onlyNumbers = value.replace(/\D/g, "");
    // Chèn dấu "-" sau ngày và tháng
    if (onlyNumbers.length <= 2) return onlyNumbers;
    if (onlyNumbers.length <= 4) return `${onlyNumbers.slice(0, 2)}-${onlyNumbers.slice(2)}`;
    return `${onlyNumbers.slice(0, 2)}-${onlyNumbers.slice(2, 4)}-${onlyNumbers.slice(4, 8)}`;
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const formattedValue = name === "dateOfBirth" ? formatDate(value) : value;
      setFormValues({ ...values, [name]: formattedValue });
    },
    [values]
  );

  const options = ["Nam", "Nữ", "Không muốn trả lời"];

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        <TextField
          label="Họ"
          type={"text"}
          value={lastName}
          color="tertiary"
          disabled
        />
                <TextField
          label="Tên"
          type={"text"}
          value={firstName}
          color="tertiary"
          disabled
        />
        <TextField
          label="Email"
          type={"email"}
          value={email}
          color="tertiary"
          disabled
        />

        <FormTextField
          label="Địa chỉ"
          name="address"
          type={"text"}
          value={values?.address}
          handleChange={handleChange}
        />
        <FormTextField
          label="Số điện thoại"
          name="phoneNumber"
          type={"number"}
          value={values?.phoneNumber}
          handleChange={handleChange}
        />

        <FormTextField
          label="Ngày sinh"
          name="dateOfBirth"
          type={"text"}
          value={values?.dateOfBirth}
          handleChange={handleChange}
          placeholder="dd-mm-yyyy"
        />

        <TextField
          label="Tuổi"
          type="text"
          value={ageCalculator(dateOfBirth)}
          color="tertiary"
          disabled
        />
        <TextField
          select
          label="Giới tính"
          value={values?.gender}
          onChange={handleChange}
          name="gender"
          color="tertiary"
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="text-center mt-2 mb-6">
        <Button
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
            "Lưu"
          )}
        </Button>
      </div>
    </>
  );
};

export default UserProfileComponent;
