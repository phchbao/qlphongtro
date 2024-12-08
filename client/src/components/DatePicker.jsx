import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePickerMUI = ({ value, handleChange, label, views }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={label}
        value={value}
        views={views}
        onChange={handleChange}
        textField={(props) => (
          <TextField {...props} inputProps={{ readOnly: true }} />
        )}
        format="DD-MM-YYYY" // Đặt định dạng ngày
      />
    </LocalizationProvider>
  );
};

export default DatePickerMUI;
