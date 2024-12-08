import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomStats } from "../../features/roomOwner/roomOwnerSlice";

const ManagementRoom = () => {
  const dispatch = useDispatch();
  const { hidden, visible, available, isLoading, alertFlag, alertMsg } = useSelector((store) => store.roomOwner);

  useEffect(() => {
    dispatch(fetchRoomStats()); // Gọi API khi component load
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {alertFlag && <p style={{ color: "red" }}>{alertMsg}</p>}
      <h1>Room Management</h1>
      <p>Hidden Rooms: {hidden}</p>
      <p>Visible Rooms: {visible}</p>
      <p>Available Rooms: {available}</p>
    </div>
  );
};

export default ManagementRoom;
