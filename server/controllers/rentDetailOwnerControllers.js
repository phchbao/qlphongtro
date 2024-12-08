import LodgerUser from "../models/LodgerUser.js";
import Room from "../models/Room.js";
import RentDetail from "../models/RentDetail.js";
import PaymentHistory from "../models/PaymentHistory.js";
import { NotFoundError, BadRequestError } from "../request-errors/index.js";
import cron from "node-cron";

/**
 * @description Create Contract
 * @route POST /api/rentDetail/createDetail
 * @returns {object} rent detail object
 */

cron.schedule("0 0 * * *", async () => {
  // Tìm tất cả các hợp đồng thuê có thể ẩn
  const rentDetails = await RentDetail.find({ isHidden: false });
  
  rentDetails.forEach(async (rentDetail) => {
    const currentDate = new Date();
    const timeDifference = currentDate - rentDetail.createdAt;

    // Kiểm tra nếu sự chênh lệch vượt quá 15 ngày
    if (timeDifference >= 15 * 24 * 60 * 60 * 1000) {
      // Cập nhật isHidden thành true
      rentDetail.isHidden = true;
      await rentDetail.save(); // Lưu thay đổi vào cơ sở dữ liệu
    }
  });
});

cron.schedule("0 0 * * *", async () => {
  const currentDate = new Date();
  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;

  // Tìm tất cả các payment history có thể ẩn (các payment cũ hơn 7 ngày)
  const payments = await PaymentHistory.find({ isHidden: false });

  payments.forEach(async (payment) => {
    const paymentDate = new Date(payment.createdAt);
    const timeDifference = currentDate - paymentDate;

    // Kiểm tra nếu sự chênh lệch vượt quá 7 ngày
    if (timeDifference >= sevenDaysInMilliseconds) {
      payment.isHidden = true; // Cập nhật trường isHidden thành true
      await payment.save(); // Lưu thay đổi vào cơ sở dữ liệu
    }
  });
});

const createRentDetail = async (req, res) => {
  const { lodger, room } = req.body;
  req.body.owner = req.user.userId;

  // check if rent detail already exists for this lodger and real estate
  const rentDetailExists = await RentDetail.findOne({
    owner: req.user.userId,
    lodger,
    room,
    isHidden: false,
  });
  if (rentDetailExists) {
    throw new BadRequestError("Chi tiết thuê đã tạo rồi");
  }

  // check if rent detail already exists for this real estate
  const rentDetailExistsForRoom = await RentDetail.findOne({
    room,  isHidden: false,
  });
  if (rentDetailExistsForRoom) {
    throw new BadRequestError(
      "Chi tiết thuê đã được tạo cho hợp đồng này!"
    );
  }

  const lodgerUser = await LodgerUser.findById(lodger);
  if (!lodgerUser) {
    throw new NotFoundError("Lodger user not found");
  }

  const roomUser = await Room.findById(room);
  if (!roomUser) {
    throw new NotFoundError("Không tìm thấy phòng");
  }

  const rentDetail = await RentDetail.create(req.body);

  res
    .status(201)
    .json({ rentDetail, msg: "Tạo chi tiết thuê thành công", success: true });
};

/**
 * @description Get all the Rent Details for owner user
 * @route GET /api/rentDetail/allRentDetails
 * @returns {object} Rent Details Array
 */
const getAllRentDetailsOwnerView = async (req, res) => {
  const rentDetails = await RentDetail.find({ owner: req.user.userId,  isHidden: false, })
    .populate({
      path: "room",
      select: "_id title price address category roomImages slug",
    })
    .populate({
      path: "lodger",
      select: "_id firstName lastName address profileImage slug email",
    })
    .populate({
      path: "owner",
      select: "_id firstName lastName address profileImage slug email",
    })
    .sort({ createdAt: -1 });

  res.json({ rentDetails, count: rentDetails.length });
};

/**
 * @description Get all the Rent Details for owner user
 * @route GET /api/rentDetail/allRentDetails
 * @returns {object} Rent Details Array
 */
const getSingleRentDetailsOwnerView = async (req, res) => {
  const rentDetail = await RentDetail.findById(req.params.rentDetailId)
    .populate({
      path: "room",
      select: "_id title price address category roomImages slug",
    })
    .populate({
      path: "lodger",
      select: "_id firstName lastName profileImage slug email phoneNumber",
    })
    .populate({
      path: "owner",
      select: "_id slug email phoneNumber firstName lastName",
    });

  if (!rentDetail||rentDetail.isHidden) {
    throw new NotFoundError("Không tìm thấy chi tiết thuê");
  }

  const rentStatus = await rentDetail.isRentPaid();

  res.json({ rentDetail, rentStatus });
};

/**
 * @description Create rent payment history
 * @route POST /api/rentDetail/createPaymentHistory
 * @returns {object} Payment Detail Object
 */
const createPaymentHistory = async (req, res) => {
  const { rentDetail } = req.body;

  // check if rent detail exists
  const checkRentDetail = await RentDetail.findById(rentDetail);
  if (!checkRentDetail) {
    throw new NotFoundError("Không tìm thấy chi tiết thuê");
  }
  const rentStatus = await checkRentDetail.isRentPaid();

  if (rentStatus) {
    throw new BadRequestError(
      "Rent payment for this month is already registered."
    );
  }

  const { currentRentDate, amountPaid, paymentMethod, nextRentDueDate } =
    req.body;

  const paymentDetail = await PaymentHistory.create({
    rentDetail,
    currentRentDate,
    amountPaid,
    paymentMethod,
  });

  // update next rent due date
  checkRentDetail.currentRentDate = nextRentDueDate;
  await checkRentDetail.save();

  res.status(201).json({ paymentDetail, msg: "Thanh toán đã được xác nhận" });
};

/**
 * @description Get All Payment History for owner user
 * @route GET /api/rentDetail/allPaymentHistory/:rentDetailId
 * @returns {object} All Payment History Array
 */
const getAllPaymentHistory = async (req, res) => {
  let paymentHistoryResults = PaymentHistory.find({
    rentDetail: req.params.rentDetailId,
    isHidden: false,
  }).sort({ createdAt: -1 });

  const page = Number(req.query.page) || 1; //page number from query string
  const limit = Number(req.query.limit) || 3; //limit of items per response
  const skip = (page - 1) * limit; //calculate the number of documents to skip

  // get the results from the database
  paymentHistoryResults = paymentHistoryResults.skip(skip).limit(limit);
  const allPaymentHistory = await paymentHistoryResults; //execute the query

  // get the total number of documents in the collection
  const totalPaymentHistory = await PaymentHistory.countDocuments({
    rentDetail: req.params.rentDetailId,
  });

  // calculate the total number of pages
  const numberOfPages = Math.ceil(totalPaymentHistory / limit);

  res.json({ allPaymentHistory, numberOfPages, totalPaymentHistory });
};

const updateElectricPrice = async (req, res) => {
  const { electricPrice } = req.body;

  if (!electricPrice || isNaN(electricPrice)) {
    throw new BadRequestError("Giá điện không hợp lệ.");
  }

  const updatedContracts = await RentDetail.updateMany(
    { owner: req.user.userId, isHidden: false },
    { $set: { electricPrice } }
  );

  if (updatedContracts.modifiedCount === 0) {
    throw new NotFoundError("Không có hợp đồng nào được cập nhật.");
  }

  res.json({
    msg: "Cập nhật giá điện thành công.",
    updatedCount: updatedContracts.modifiedCount,
  });
};

const updateWaterPrice = async (req, res) => {
  const { waterPrice } = req.body;

  if (!waterPrice || isNaN(waterPrice)) {
    throw new BadRequestError("Giá nước không hợp lệ.");
  }

  const updatedContracts = await RentDetail.updateMany(
    { owner: req.user.userId, isHidden: false },
    { $set: { waterPrice } }
  );

  if (updatedContracts.modifiedCount === 0) {
    throw new NotFoundError("Không có hợp đồng nào được cập nhật.");
  }

  res.json({
    msg: "Cập nhật giá nước thành công.",
    updatedCount: updatedContracts.modifiedCount,
  });
};

const updateService = async (req, res) => {
  const { service } = req.body;

  if (!service || isNaN(service)) {
    throw new BadRequestError("Giá dịch vụ không hợp lệ.");
  }

  const updatedContracts = await RentDetail.updateMany(
    { owner: req.user.userId, isHidden: false },
    { $set: { service } }
  );

  if (updatedContracts.modifiedCount === 0) {
    throw new NotFoundError("Không có hợp đồng nào được cập nhật.");
  }

  res.json({
    msg: "Cập nhật giá dịch vụ thành công.",
    updatedCount: updatedContracts.modifiedCount,
  });
};


export {
  createRentDetail,
  getAllRentDetailsOwnerView,
  getSingleRentDetailsOwnerView,
  createPaymentHistory,
  getAllPaymentHistory,
  updateElectricPrice,
  updateWaterPrice,
  updateService,
};
