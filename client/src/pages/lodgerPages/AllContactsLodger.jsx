import { useEffect, useState } from "react";
import { getAllContacts } from "../../features/lodgerUser/lodgerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { Footer, ContactsCard } from "../../components";
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const AllContacts = () => {
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.lodgerUser);

  const [searchQuery, setSearchQuery] = useState(""); // Đổi tên biến để bao hàm cả tìm kiếm tên hoặc email

  useEffect(() => {
    // Lấy toàn bộ danh sách liên hệ khi vừa tải trang
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Cập nhật giá trị tìm kiếm
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(getAllContacts({ name: searchQuery })); // Gửi truy vấn tìm kiếm tên hoặc email
  };

  return (
    <>
      <main className="flex flex-col mb-12 mt-6 md:items-start md:ml-10">
        <h3 className="mb-4 font-heading font-bold text-center">LIÊN HỆ</h3>
        <div className="w-2/3 mb-4 mx-auto md:mx-0">
          <form onSubmit={handleSearchSubmit}>
            <FormControl
              color="tertiary"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <OutlinedInput
                color="tertiary"
                name="search"
                type="text"
                size="small"
                placeholder="Nhập tên hoặc email..."
                value={searchQuery}
                onChange={handleSearchChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" type="submit">
                      <SearchRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </form>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mx-4 md:justify-start md:mx-0">
          {isLoading ? (
            <div className="flex justify-center mt-12 h-96">
              <CircularProgress size={"10rem"} />
            </div>
          ) : (
            <>
              {contacts?.length === 0 ? (
                <h3 className="text-center mt-8 mb-6">Không tìm thấy liên hệ</h3>
              ) : (
                <>
                  {contacts?.map((user) => {
                    return <ContactsCard key={user._id} {...user} lodger />;
                  })}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AllContacts;
