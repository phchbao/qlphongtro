import Room from "../models/Room.js";
import { NotFoundError } from "../request-errors/index.js";
import LodgerUser from "../models/LodgerUser.js";

/**
 * @description Get all rooms
 * @returns {object} room array
 */
const getAllRooms = async (req, res) => {
  const { search, category, priceFilter, province, district } = req.query;

  const queryObject = {
    status: true, // chỉ hiển thị phòng đang có sẵn
    isHidden: false, // bỏ qua các phòng bị ẩn
  };

  if (search) {
    queryObject.title = { $regex: search, $options: "i" };
  }

  if (category !== "all") {
    queryObject.category = category;
  }

  if (priceFilter) {
    const [minPrice, maxPrice] = priceFilter.split("-");
    queryObject.price = { $gte: minPrice, $lte: maxPrice };
  }

  if (province) {
    queryObject["address.province"] = province;
  }

  if (district) {
    queryObject["address.district"] = district;
  }

  let roomResult = Room.find(queryObject)
    .populate({
      path: "roomOwner",
      select: "-password -createdAt -updatedAt -__v -contacts",
    })
    .sort({ createdAt: -1 });

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  roomResult = roomResult.skip(skip).limit(limit);
  const allRoom = await roomResult;

  const totalRooms = await Room.countDocuments(queryObject);
  const numberOfPages = Math.ceil(totalRooms / limit);

  res.json({ allRoom, numberOfPages, totalRooms });
};

/**
 * @description Get single room
 * @returns {object} room
 */
const getSingleRoom = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req.user;

  const room = await Room.findOne({ slug, isHidden: false }).populate({
    path: "roomOwner",
    select: "-password -createdAt -updatedAt -__v -contacts",
  });

  if (!room) {
    throw new NotFoundError(`Room was not found`);
  }

  const { _id: id } = room;

  // kiểm tra nếu phòng đã được lưu bởi người dùng
  const currentLodgerUser = await LodgerUser.findById(userId);
  const isSaved = currentLodgerUser.savedRooms.includes(id.toString());

  res.json({ room, isSaved });
};

/**
 * @description Save room if not saved otherwise remove from saved list
 * @returns {object} LodgerUser
 */
const saveRoomToggle = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const toSaveRoom = await Room.findOne({ _id: id, isHidden: false });

  if (!toSaveRoom) {
    throw new NotFoundError(`Room with id: ${id} not found or is isHidden`);
  }

  const currentLodgerUser = await LodgerUser.findById(userId);

  // kiểm tra nếu phòng đã được lưu bởi người dùng
  if (currentLodgerUser.savedRooms.includes(id)) {
    currentLodgerUser.savedRooms = currentLodgerUser.savedRooms.filter(
      (roomId) => roomId.toString() !== id
    );
    const updatedUser = await LodgerUser.findOneAndUpdate(
      { _id: userId },
      {
        savedRooms: currentLodgerUser.savedRooms,
      },
      { new: true, runValidators: true }
    );

    res.json({
      updatedUser,
      message: "Room removed from saved rooms",
      isSaved: false,
    });
  } else {
    // thêm phòng vào danh sách đã lưu
    const updatedUser = await LodgerUser.findOneAndUpdate(
      { _id: userId },
      {
        $push: { savedRooms: id },
      },
      { new: true, runValidators: true }
    );

    res.json({
      updatedUser,
      message: "Lưu phòng thành công",
      isSaved: true,
    });
  }
};

/**
 * @description Get all saved rooms
 * @returns {object} room array
 */
const getAllSavedRooms = async (req, res) => {
  const { userId } = req.user;

  const currentLodgerUser = await LodgerUser.findById(userId).populate({
    path: "savedRooms",
    match: { isHidden: false }, // chỉ hiển thị các phòng không bị ẩn
    select: "-createdAt -updatedAt -__v",
    populate: {
      path: "roomOwner",
      model: "OwnerUser",
      select: "-createdAt -updatedAt -__v -contacts",
    },
  });

  if (!currentLodgerUser) {
    throw new NotFoundError(`User with id: ${userId} not found`);
  }

  // đảo ngược danh sách phòng đã lưu để hiển thị phòng mới nhất trước
  currentLodgerUser.savedRooms.reverse();

  res.json({ savedRooms: currentLodgerUser.savedRooms });
};

export { getAllRooms, getSingleRoom, saveRoomToggle, getAllSavedRooms };
