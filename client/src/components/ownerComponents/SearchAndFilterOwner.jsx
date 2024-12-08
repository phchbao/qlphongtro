import { Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import IconButton from "@mui/material/IconButton";

const SearchAndFilterOwner = ({
  handleSearchSubmit,
  handleValueChange,
  clearFilter,
  search,
  status,
}) => {
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
          placeholder="Nhập tên phòng hoặc mã phòng..."
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
        <div className="flex w-44 md:w-48 mt-2 items-center">
          <label htmlFor="status" className="font-robotoNormal mx-2">
            Phòng
          </label>
          <select
            id="status"
            name="status"
            className="bg-gray-50 border border-gray-300 rounded-lg block p-2.5 w-full"
            onChange={handleValueChange}
            value={status}
          >
            <option value="">tất cả</option> {/* Trạng thái rỗng */}
            <option value="true">trống</option>
            <option value="false">đang thuê</option>
          </select>
        </div>

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

export default SearchAndFilterOwner;
