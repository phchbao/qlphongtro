import { useState, useEffect, useCallback } from "react";
import { getAllRoom } from "../../features/roomLodger/roomLodgerSlice";
import { useDispatch, useSelector } from "react-redux";
import { RoomCard, Footer, SearchAndFilter } from "../../components";
import { Pagination, PaginationItem, CircularProgress } from "@mui/material";

const Homepage = () => {
  const dispatch = useDispatch();

  const { allRoom, isLoading, numberOfPages } = useSelector(
    (store) => store.roomLodger
  );

  // initial query for search and filter
  const initialQuery = {
    page: 1,
    search: "",
    category: "all",
    lowerLimit: "",
    upperLimit: "",
    priceFilter: "",
    province: "",
    district: "",
  };

  const [query, setQuery] = useState(initialQuery);

  // get all real estate on page load and when page number changes
  useEffect(() => {
    dispatch(getAllRoom({ ...query }));
  }, [query.page]);

  // update price filter when lower and upper limit changes
  useEffect(() => {
    if (query.lowerLimit && query.upperLimit) {
      query.priceFilter = query.lowerLimit + "-" + query.upperLimit;
    }
  }, [query.lowerLimit, query.upperLimit]);

  // function to handle page number change
  const handlePageChange = useCallback(
    (event, value) => {
      setQuery({ ...query, page: value });
    },
    [query]
  );

  // function to handle search and filter query value change
  const handleValueChange = useCallback(
    (event) => {
      setQuery({ ...query, [event.target.name]: event.target.value });
    },
    [query]
  );

  // function to handle search and filter submission and reset page number to 1
  const handleSearchSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(getAllRoom({ ...query, page: 1 }));
    },
    [query, dispatch]
  );

  // function to clear search and filter
  const clearFilter = useCallback(() => {
    setQuery(initialQuery);
    dispatch(getAllRoom({ ...initialQuery }));
  }, [dispatch]);

  return (
    <>
      <div className="mt-8">
        <SearchAndFilter
          handleSearchSubmit={handleSearchSubmit}
          handleValueChange={handleValueChange}
          clearFilter={clearFilter}
          {...query}
        />

        {isLoading ? (
          <div className="flex justify-center mt-12 h-96">
            <CircularProgress size={"8rem"} />
          </div>
        ) : (
          <>
            <h3 className="text-center mt-8 mb-6 font-heading font-bold">
              Danh sách phòng
            </h3>

            {allRoom?.length === 0 ? (
              <h2 className="text-center mt-8 mb-6 font-heading font-bold">
                Không tìm thấy phòng nào
              </h2>
            ) : (
              <main className="flex flex-wrap gap-5 justify-center mb-12 md:justify-center mx-4 md:mx-0">
                {allRoom?.map((item) => {
                  return <RoomCard key={item._id} {...item} />;
                })}
              </main>
            )}
          </>
        )}
      </div>

      <Pagination
        count={numberOfPages || 1}
        page={query?.page}
        onChange={handlePageChange}
        color="secondary"
        className="flex justify-center mb-12"
        renderItem={(item) => {
          if (item.type === "first") {
            return (
              <PaginationItem
                {...item}
                disabled={query?.page === 1}
                onClick={() => setQuery({ ...query, page: 1 })}
                aria-label="Trang đầu tiên"
                label="<<"
              />
            );
          }
          if (item.type === "last") {
            return (
              <PaginationItem
                {...item}
                disabled={query?.page === numberOfPages}
                onClick={() => setQuery({ ...query, page: numberOfPages })}
                aria-label="Trang cuối cùng"
                label=">>"
              />
            );
          }
          return <PaginationItem {...item} />;
        }}
        showFirstButton
        showLastButton
      />
      <Footer />
    </>
  );
};

export default Homepage;
