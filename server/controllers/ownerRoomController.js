import Room from "../models/Room.js";
import { nanoid } from "nanoid";
import {
  NotFoundError,
  ForbiddenRequestError,
  BadRequestError,
} from "../request-errors/index.js";

/**
 * @description Post Real Estate
 * @returns {object} room
 */
const postRoom = async (req, res) => {
  const province = req.body.province;
  const district = req.body.district;
  const detailAddress = req.body.detailAddress;
  req.body.address = { province, district, detailAddress };
  req.body.roomOwner = req.user.userId;
  req.body.roomId = nanoid(7);

  const room = await Room.create(req.body);
  res.status(201).json({ room });
};

/**
 * @description Get Owner's Real Estates
 * @returns {object} room
 */

const getOwnerRooms = async (req, res) => {
  const page = Number(req.query.page) || 1; // Số trang hiện tại từ query string
  const limit = 3; // Số lượng phòng trên mỗi trang
  const skip = (page - 1) * limit; // Số lượng tài liệu cần bỏ qua

  const roomResults = Room.find({
    roomOwner: req.user.userId,
    isHidden: false, // Chỉ lấy phòng không bị ẩn
  })
    .sort("-createdAt") // Sắp xếp theo thời gian tạo giảm dần
    .skip(skip) // Bỏ qua một số tài liệu
    .limit(limit); // Giới hạn số lượng tài liệu trên mỗi trang

  const rooms = await roomResults; // Thực hiện truy vấn sau khi áp dụng skip và limit

  //get total documents in the Room collection

  const totalRooms = await Room.countDocuments({
    roomOwner: req.user.userId,
    isHidden: false,
  });

  //calculate total pages
  const numberOfPages = Math.ceil(totalRooms / limit);

  res.json({ rooms, numberOfPages, totalRooms });
};

const getAllOwnerRooms = async (req, res) => {
  const { search, status } = req.query;

  // Khởi tạo đối tượng truy vấn
  const queryObject = {
    isHidden: false, // Bỏ qua các phòng bị ẩn
    roomOwner: req.user.userId, // Chỉ lấy phòng thuộc về chủ sở hữu hiện tại
  };

  // Thêm điều kiện tìm kiếm nếu có từ khóa
  if (search) {
    queryObject.$or = [
      { title: { $regex: search, $options: "i" } }, // Tìm kiếm theo title
      { roomId: { $regex: search, $options: "i" } }, // Tìm kiếm theo roomId
    ];
  }

  // Thêm điều kiện tìm kiếm theo trạng thái nếu được cung cấp
  if (status === "true") {
    queryObject.status = true; // Lọc theo trạng thái "phòng trống"
  } else if (status === "false") {
    queryObject.status = false; // Lọc theo trạng thái "phòng đang thuê"
  }

  try {
    let roomResult = Room.find(queryObject)
      .populate({
        path: "roomOwner",
        select: "-password -createdAt -updatedAt -__v -contacts",
      })
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

    // Phân trang
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    roomResult = roomResult.skip(skip).limit(limit);

    // Thực hiện truy vấn
    const allRoom = await roomResult;

    // Đếm tổng số phòng phù hợp
    const totalRooms = await Room.countDocuments({
      roomOwner: req.user.userId,
      isHidden: false,
    });
    const numberOfPages = Math.ceil(totalRooms / limit);

    // Gửi kết quả phản hồi
    res.json({ allRoom, numberOfPages, totalRooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách phòng" });
  }
};


/**
 * @description Get single room
 * @returns {object} room
 */
const getSingleRoom = async (req, res) => {
  const { slug } = req.params;
  //const room = await Room.findOne({ slug });
  const room = await Room.findOne({ slug, isHidden: false });
  if (!room) {
    throw new NotFoundError(`Room not found`);
  }
  res.json({ room });
};

/**
 * @description Cập nhật chi tiết bài đăng
 * @returns {object} room
 */
const updateRoomDetails = async (req, res) => {
  const {
    price,
    province,
    district,
    detailAddress,
    description,
    area,
    beds,
    amenities,
    category,
  } = req.body;

  if (
    !price ||
    !province ||
    !district ||
    !detailAddress||
    !description ||
    !area ||
    !beds ||
    !amenities ||
    !category
  ) {
    throw new BadRequestError("All fields are required");
  }

  const { slug } = req.params;
  const room = await Room.findOne({ slug });

  if (!room || room.isHidden) {
    throw new NotFoundError(`Room not found`);
  }

  if (room.roomOwner.toString() !== req.user.userId) {
    throw new ForbiddenRequestError(
      "You are not authorized to update this room"
    );
  }

  const updatedRoom = await Room.findOneAndUpdate(
    { slug },
    {
      price,
      description,
      area,
      beds,
      amenities,
      category,
      address: { province, district, detailAddress },
    },
    { new: true, runValidators: true }
  );

  res.json({ updatedRoom });
};

/**
 * @description Cập nhật chi tiết bài đăng
 * @returns message
 */
const deleteRoom = async (req, res) => {
  const { slug } = req.params;
  const room = await Room.findOne({ slug });

  if (!room || room.isHidden) {
    throw new NotFoundError(`Room not found`);
  }

  // check if user is authorized to delete room
  if (room.roomOwner.toString() !== req.user.userId) {
    throw new ForbiddenRequestError(
      "You are not authorized to delete this room"
    );
  }

  // check if room is okay to delete
  if (room.status === false) {
    throw new BadRequestError(
      "Room cannot be deleted, it has active lodger"
    );
  }

 /* await Room.findOneAndDelete({
    slug,
    roomOwner: req.user.userId,
    status: true,
  }); */

  room.isHidden = true;
  await room.save();

  res.json({ success: true, message: "Xóa phòng thành công" });
};

const getRoomStats = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const stats = await Room.aggregate([
      { $match: { roomOwner: ownerId } },
      {
        $group: {
          _id: null,
          hidden: { $sum: { $cond: ["$isHidden", 1, 0] } },
          visible: { $sum: { $cond: [{ $eq: ["$isHidden", false] }, 1, 0] } },
          available: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$isHidden", false] }, { $eq: ["$status", true] }] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const { hidden = 0, visible = 0, available = 0 } = stats[0] || {};

    res.status(200).json({ hidden, visible, available });
  } catch (error) {
    console.error("Error fetching room stats:", error);
    res.status(500).json({ msg: "Lỗi khi lấy thống kê phòng" });
  }
};


export {
  postRoom,
  getOwnerRooms,
  getAllOwnerRooms,
  getSingleRoom,
  updateRoomDetails,
  deleteRoom,
  getRoomStats,
};
