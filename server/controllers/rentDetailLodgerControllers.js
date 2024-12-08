import RentDetail from "../models/RentDetail.js";
import PaymentHistory from "../models/PaymentHistory.js";
import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Get Single Rent Detail for lodger user
 * @route GET /api/rentDetailLodger/:roomId
 * @returns {object} Rent Detail object
 */
const getSingleRentDetailsLodgerView = async (req, res) => {
  const rentDetail = await RentDetail.findOne({
    room: req.params.roomId,
    lodger: req.user.userId,
    isHidden: false,
  })
    .populate({
      path: "room",
      select: "_id title price address roomImages slug",
    })
    .populate({
      path: "owner",
      select: "_id slug email phoneNumber firstName lastName profileImage",
    });

  if (!rentDetail) {
    throw new NotFoundError("Không tìm thấy chi tiết thuê");
  }

  const rentStatus = await rentDetail.isRentPaid();
  res.json({ rentDetail, rentStatus });
};

/**
 * @description Get All Payment History for lodger user
 * @route GET /api/rentDetailLodger/allPaymentHistory/:rentDetailId
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

export { getSingleRentDetailsLodgerView, getAllPaymentHistory };
