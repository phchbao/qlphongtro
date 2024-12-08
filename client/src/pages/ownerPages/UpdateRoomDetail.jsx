import { useCallback, useEffect } from "react";
import { AlertToast, PageLoading, UpdateRoomForm } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  clearAlert,
  updateRoomDetail,
  getRoomDetail,
} from "../../features/roomOwner/roomOwnerSlice";
import postRoomImg from "../../assets/images/postRoomImg.svg";
import postRoomImg2 from "../../assets/images/postRoomImg2.svg";
import postRoomImg3 from "../../assets/images/postRoomImg3.svg";

const UpdateRoomDetail = () => {
  const {
    alertFlag,
    alertMsg,
    alertType,
    isLoading,
    room,
    postSuccess,
    isProcessing,
  } = useSelector((store) => store.roomOwner);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getRoomDetail({ slug }));
  }, [slug, dispatch]);

  // Redirect to real estate detail page of the room after successful update
  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => {
        navigate(`/owner/tro-so/${room?.slug}`);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [postSuccess, navigate, room?.slug]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    dispatch(updateRoomDetail({ slug, formValues }));
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

  if (isLoading) return <PageLoading />;

  return (
    <div>
      <main className="px-6 h-full mt-7">
        <div className="flex lg:justify-between justify-center flex-wrap h-full g-6">
          <div className="lg:w-5/12 md:w-8/12 mb-12">
            <form onSubmit={handleSubmit} id="form">
              <div className="flex justify-center items-center flex-col mt-3 mb-4">
                <h3 className="font-heading font-bold">
                  Cập nhật chi tiết bài đăng
                </h3>
              </div>
              <UpdateRoomForm {...room} isProcessing={isProcessing} />
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

export default UpdateRoomDetail;
