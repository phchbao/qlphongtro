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

const importRooms = async (req, res) => {
  try {
    const roomsData = req.body; // Dữ liệu JSON từ frontend (array)
    const userId = req.user.userId; // Lấy thông tin người dùng đang đăng nhập

    if (!Array.isArray(roomsData)) {
      return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ!" });
    }

    const importedRooms = await Promise.all(
      roomsData.map(async (room) => {
        const newRoom = {
          title: room.title,
          slug: undefined, // Để mongoose-slug-generator tự tạo
          roomId: nanoid(7),
          address: room.address,
          description: room.description,
          price: room.price,
          area: room.area,
          beds: room.beds,
          amenities: room.amenities,
          category: room.category,
          roomImages: room.roomImages, // Sử dụng ảnh từ frontend gửi lên
          roomOwner: userId,
          status: room.status,
        };

        return Room.create(newRoom);
      })
    );

    res.status(201).json({
      success: true,
      data: importedRooms,
    });
  } catch (error) {
    console.error("Lỗi khi import dữ liệu:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi import dữ liệu!",
    });
  }
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
  const { search, status, category, priceFilter, province, district } = req.query;

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

  // Thêm điều kiện lọc theo category
  if (category && category !== "all") {
    queryObject.category = category;
  }

  // Thêm điều kiện lọc theo priceFilter
  if (priceFilter) {
    const [minPrice, maxPrice] = priceFilter.split("-");
    queryObject.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }

  // Thêm điều kiện lọc theo tỉnh/thành phố
  if (province) {
    queryObject["address.province"] = province;
  }

  // Thêm điều kiện lọc theo quận/huyện
  if (district) {
    queryObject["address.district"] = district;
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
    const totalRooms = await Room.countDocuments(queryObject);
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

export {
  postRoom,
  getOwnerRooms,
  getAllOwnerRooms,
  getSingleRoom,
  updateRoomDetails,
  deleteRoom,
  importRooms,
};
