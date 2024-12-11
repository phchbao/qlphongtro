import { Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import IconButton from "@mui/material/IconButton";
import { provinceNames } from "../../utils/provinceNames";
import districtsByProvince from "../../utils/districtsByProvince.json";

const SearchAndFilter = ({
  handleSearchSubmit,
  handleValueChange,
  clearFilter,
  search,
  category,
  lowerLimit,
  upperLimit,
  province,
  district,
  status, // Thêm status vào đây
}) => {
  const categories = [
    "all",
    "Chung cư mini",
    "Truyền thống",
    "Sleepbox",
    "KTX",
    "Homestay",
  ];

  // Các trạng thái: tất cả, trống, đang thuê
  const statuses = [
    { label: "Tất cả", value: "" }, // Không lọc
    { label: "Trống", value: true }, // Trống (status = true)
    { label: "Đang thuê", value: false }, // Đang thuê (status = false)
  ];

  return (
    <form action="" onSubmit={handleSearchSubmit} className="text-center">
      <FormControl
        color="tertiary"
        sx={{ width: "100%", marginBottom: "10px" }}
        variant="outlined"
      >
        <OutlinedInput
          color="tertiary"
          name="search"
          type="text"
          placeholder="Nhập tên hoặc mã phòng..."
          value={search}
          onChange={handleValueChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton edge="end" type="submit">
                <SearchRoundedIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <div className="flex justify-center gap-2 flex-wrap items-center">
        {/* Dropdown Loại */}
        <div className="flex w-44 md:w-48 mt-2 items-center">
          <label htmlFor="category" className="font-robotoNormal mx-2">
            Loại
          </label>
          <select
            id="category"
            name="category"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            onChange={handleValueChange}
            value={category}
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Tỉnh */}
        <div className="flex w-44 md:w-48 mt-2 items-center">
          <label htmlFor="province" className="font-robotoNormal mx-2">
            Tỉnh
          </label>
          <select
            id="province"
            name="province"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            onChange={handleValueChange}
            value={province}
          >
            <option value="">Chọn tỉnh</option>
            {provinceNames.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Huyện */}
        <div className="flex w-44 md:w-48 mt-2 items-center">
          <label htmlFor="district" className="font-robotoNormal mx-2">
            Huyện
          </label>
          <select
            id="district"
            name="district"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            onChange={handleValueChange}
            value={district}
          >
            <option value="">Chọn huyện</option>
            {districtsByProvince[province]?.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Trạng thái */}
        <div className="flex w-44 md:w-48 mt-2 items-center">
          <label htmlFor="status" className="font-robotoNormal mx-2">
            hiện
          </label>
          <select
            id="status"
            name="status"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            onChange={handleValueChange}
            value={status}
          >
            {statuses.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Input Giá từ - đến */}
        <div className="flex items-center gap-2 mt-2">
          <label className="font-robotoNormal">Mức giá:</label>
          <input
            type="number"
            name="lowerLimit"
            className="w-20 text-sm h-8 border border-gray-300 rounded-lg text-center"
            placeholder="Từ"
            value={lowerLimit}
            onChange={handleValueChange}
          />
          <span>đến</span>
          <input
            type="number"
            name="upperLimit"
            className="w-20 text-sm h-8 border border-gray-300 rounded-lg text-center"
            placeholder="Đến"
            value={upperLimit}
            onChange={handleValueChange}
          />
        </div>

        {/* Nút Hành Động */}
        <Button
          size="small"
          variant="contained"
          type="submit"
          color="tertiary"
          sx={{ color: "#fff" }}
        >
          LỌC
        </Button>
        <Button
          variant="text"
          onClick={clearFilter}
          color="error"
          size="small"
        >
          ĐẶT LẠI
        </Button>
      </div>
    </form>
  );
};

export default SearchAndFilter;
