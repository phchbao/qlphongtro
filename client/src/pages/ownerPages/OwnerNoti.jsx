import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "../../features/ownerUser/ownerUserSlice";
import { PageLoading, NotiUsers, NotiMessages } from "../../components";
import { io } from "socket.io-client";

const OwnerNoti = () => {
  const dispatch = useDispatch();
  const socket = useRef();

  const { contacts, isLoading } = useSelector((state) => state.ownerUser);
  const { user } = useSelector((state) => state.auth);
  const [currentNoti, setCurrentNoti] = useState(null);
  const [currentSelectedNotiIndex, setCurrentNotiIndex] = useState(null);

  useEffect(() => {
    if (user) {
      socket.current = io(import.meta.env.VITE_APP_API_HOST);
      socket.current.emit("addUser", user._id);
    }
  }, [user]);

  useEffect(() => {
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const handleCurrentNotiChange = (contact, index) => {
    setCurrentNoti(contact);
    setCurrentNotiIndex(index);
  };

  if (isLoading) {
    return <PageLoading />;
  }
  if (contacts?.length === 0) {
    return (
      <div className="mt-12">
        <h3 className="font-robotoNormal text-center">
          Thêm liên hệ mới để bắt đầu cuộc trò chuyện
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-wrap justify-center gap-8 md:justify-start mt-12 mb-8 mx-2 md:mx-4">
      <h1 className="font-heading font-bold">Noti</h1>
      <div
        className="flex gap-4"
        style={{
          maxHeight: "500px",
        }}
      >
        <div className="flex flex-col gap-4 w-1/3 overflow-y-auto overflow-x-hidden">
          {contacts?.map((contact, index) => (
            <div
              key={contact?._id}
              onClick={() => handleCurrentNotiChange(contact, index)}
            >
              <div
                className={`${
                  currentSelectedNotiIndex === index && "bg-slate-300"
                } rounded-md`}
              >
                <NotiUsers contact={contact} currentUser={user.slug} />
              </div>
            </div>
          ))}
        </div>
        <NotiMessages
          noti={currentNoti}
          currentUser={user.slug}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default OwnerNoti;
