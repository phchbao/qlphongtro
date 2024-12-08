import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSavedRoom } from "../../features/roomLodger/roomLodgerSlice";
import { PageLoading, RoomCard, Footer } from "../../components";

const SavedRoom = () => {
  const { allRoom, isLoading } = useSelector(
    (store) => store.roomLodger
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSavedRoom());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (allRoom?.length === 0)
    return (
      <h1 className="text-center mt-8 mb-6 font-heading">
        Chưa lưu phòng nào
      </h1>
    );

  return (
    <>
      <main className="flex flex-col mb-12 mt-8 md:items-start md:ml-10">
        <h3 className="my-4 font-heading font-bold text-center">
          Danh sách phòng đã lưu
        </h3>
        <div className="justify-center flex flex-wrap gap-8 mx-4 md:justify-start md:mx-0">
          {allRoom?.map((item) => {
            return <RoomCard key={item._id} {...item} />;
          })}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SavedRoom;
