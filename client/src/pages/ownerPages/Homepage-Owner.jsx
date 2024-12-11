import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOwnerRoom } from "../../features/roomOwner/roomOwnerSlice";
import { Footer, RoomCard, SearchAndFilterOwner } from "../../components";
import { Button, Pagination, CircularProgress } from "@mui/material";

const Homepage = () => {
  const dispatch = useDispatch();

  const { allRoom, isLoading, numberOfPages } = useSelector(
    (store) => store.roomOwner
  );

  const initialQuery = {
    page: 1,
    search: "",
    status:"",
    category: "all",
    lowerLimit: "",
    upperLimit: "",
    priceFilter: "",
    province: "",
    district: "",
  };

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    dispatch(getAllOwnerRoom({ ...query }));
  }, [query.page]);

  useEffect(() => {
    if (query.lowerLimit && query.upperLimit) {
      query.priceFilter = query.lowerLimit + "-" + query.upperLimit;
    }
  }, [query.lowerLimit, query.upperLimit]);

  const handlePageChange = useCallback(
    (event, value) => {
      setQuery({ ...query, page: value });
    },
    [query]
  );

  const handleValueChange = useCallback(
    (event) => {
      setQuery({ ...query, [event.target.name]: event.target.value });
    },
    [query]
  );

  const handleSearchSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(getAllOwnerRoom({ ...query, page: 1 }));
    },
    [query, dispatch]
  );

  const clearFilter = useCallback(() => {
    setQuery(initialQuery);
    dispatch(getAllOwnerRoom({ ...initialQuery }));
  }, [dispatch]);

    return (
      <>
        <div className="mt-8">
          <SearchAndFilterOwner
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
                    return <RoomCard key={item._id} {...item} fromOwnerUser={true}/>;
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
        />
        <Footer />
      </>
    );
  };
  
  export default Homepage;


