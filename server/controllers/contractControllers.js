import LodgerUser from "../models/LodgerUser.js";
import OwnerUser from "../models/OwnerUser.js";
import Room from "../models/Room.js";
import Contract from "../models/Contract.js";
import RentDetail from "../models/RentDetail.js";
import PaymentHistory from "../models/PaymentHistory.js";

import { NotFoundError, BadRequestError } from "../request-errors/index.js";
import { sendEmail } from "../utils/emailSender.js";

/**
 * @description Create Contract
 * @route PATCH /api/owner/contract
 * @returns {object} Contract object
 */
const createContract = async (req, res) => {
  const { lodger, room } = req.body;
  req.body.owner = req.user.userId;

  //check if contract already exists for this lodger and real estate
  const contractExists = await Contract.findOne({
    owner: req.user.userId,
    lodger,
    room,
    isHidden: false,
  });
  if (contractExists) {
    throw new BadRequestError("Contract already exists");
  }

  //check if contract already exists for this real estate
  const contractForRoom = await Contract.findOne({
    room,isHidden: false,
  });
  if (contractForRoom) {
    throw new BadRequestError("Contract already exists for this real estate");
  }

  const ownerUser = await OwnerUser.findById(req.user.userId);

  const lodgerUser = await LodgerUser.findById(lodger);
  if (!lodgerUser) {
    throw new NotFoundError("Lodger user not found");
  }

  const roomUser = await Room.findById(room);
  if (!roomUser) {
    throw new NotFoundError("Real estate not found");
  }

  const contract = await Contract.create(req.body);
  const to = lodgerUser.email;
  const from = ownerUser.email;
  const subject = `Hợp đồng cho thuê phòng ${roomUser.title}`;
  const body = `
    <p> Xin chào ${lodgerUser.lastName} ${lodgerUser.firstName},</p> 
    <p> Tôi là ${ownerUser.lastName} ${ownerUser.firstName}, đại diện bên cho thuê</p> 
    <p>Tôi viết mail này để thông báo cho bạn biết là tôi đã soạn hợp đồng thuê trọ phòng <strong>${roomUser.title}</strong>.</p>
    <p>Truy cập liên kết bên dưới để xem bản hợp đồng. Vui lòng đọc kĩ các điều khoản trước khi xác nhận hợp đồng.</p>
    <a href="${process.env.CLIENT_URL}/#/lodger/contract-agreement/${contract._id}"><strong>Xem hợp đồng</strong></a><br>
    <p>Hợp đồng cho thuê có tính ràng buộc về mặt pháp lý và cả hai bên phải tuân thủ các điều khoản và điều kiện của hợp đồng.</p>
    <p>Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về hợp đồng cho thuê hoặc quy trình cho thuê, vui lòng liên hệ với tôi.</p>
   <p>....................................</p>
    <p>Trân trọng,</p>
    <p>${ownerUser.lastName} ${ownerUser.firstName}</p>
    <p>${ownerUser.email}</p>
    <p>${ownerUser.phoneNumber}</p>`;

  //send email to lodger user to approve the contract
  await sendEmail(to, from, subject, body);

  //change the status of the real estate to false
  roomUser.status = false;
  await roomUser.save();

  res.json({ contract });
};

/**
 * @description Get contract details for lodger user
 * @route GET /api/contract/lodgerView/:contractId
 * @returns {object} 200 - An object containing the contract details
 */
const getContractDetailLodgerView = async (req, res) => {
  const contractDetail = await Contract.findOne({
    _id: req.params.contractId,
    lodger: req.user.userId,
    isHidden: false,
  })
    .populate({
      path: "room",
      select: "title address category slug",
    })
    .populate({
      path: "owner",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "lodger",
      select: "firstName lastName",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

/**
 * @description Approve contract
 * @route PATCH /api/contract/approve/:contractId
 * @returns {object} 200 - An object containing the contract details
 */
const approveContract = async (req, res) => {
  const contractDetail = await Contract.findOne({
    _id: req.params.contractId,
    lodger: req.user.userId,
    isHidden: false,
  })
    .populate({
      path: "room",
      select: "title address",
    })
    .populate({
      path: "owner",
      select: "firstName lastName email",
    })
    .populate({
      path: "lodger",
      select: "firstName lastName email address",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  const to = contractDetail.owner.email;
  const from = contractDetail.lodger.email;
  const subject = `Hợp đồng ${contractDetail.room.title} đã được xác nhận`;
  const body = `
    <p> Xin chào ${contractDetail.owner.lastName}  ${contractDetail.owner.firstName},</p>
    <p> Tôi là ${contractDetail.lodger.lastName} ${contractDetail.lodger.firstName}, đại diện bên thuê </p>
    <p> Tôi đã xem qua hợp đồng của bạn. Sau khi đọc kĩ các điều khoản, tôi xác nhận hợp đồng.</p>
    <p>Cảm ơn bạn đã tư vấn nhiệt tình.</p>
    <p>Mong bạn vẫn sẽ tiếp tục hỗ trợ tôi trong khoảng thời gian tôi ở trọ.</p>
    <p>.........................</p>
    <p>Trân trọng,</p>
    <p>${contractDetail.lodger.lastName} ${contractDetail.lodger.firstName}</p>
    <p>${contractDetail.lodger.email} </p>
    <p>${contractDetail.lodger.phoneNumber}</p>`;

  //send email to owner user to approve the contract
  await sendEmail(to, from, subject, body);

  //change the status of the contract to true
  contractDetail.status = "Active";
  await contractDetail.save();

  res.json({ contractDetail });
};

/**
 * @description Get contract details for owner user
 * @route GET /api/contract/ownerView/:roomId
 * @returns {object} 200 - An object containing the contract details
 */
const getContractDetailOwnerView = async (req, res) => {
  const contractDetail = await Contract.findOne({
    owner: req.user.userId,
    room: req.params.roomId,
    isHidden: false,
  })
    .populate({
      path: "room",
      select: "title address category slug",
    })
    .populate({
      path: "lodger",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "owner",
      select: "firstName lastName",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

/**
 * @description Delete contract
 * @route GET /api/contract/ownerView/:roomId
 * @returns
 */
const deleteContract = async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.contractId,
    owner: req.user.userId,
  });

  if (!contract) {
    throw new NotFoundError("Contract not found");
  }

  // Gán isHidden = true thay vì xóa
  contract.isHidden = true;
  await contract.save();

  // Tìm kiếm bất động sản liên quan và cập nhật trạng thái
  const room = await Room.findById(contract.room);
  if (!room) {
    throw new NotFoundError("Real Estate Not Found");
  }

  // Đặt trạng thái phòng trở lại "true" (có thể cho thuê)
  room.status = true;
  await room.save();

  // Cập nhật chi tiết tiền thuê liên quan
  const rentDetail = await RentDetail.findOne({
    room: contract.room,
    lodger: contract.lodger,
    owner: contract.owner,
  });

  if (rentDetail) {
    rentDetail.isHidden = true; // Ẩn chi tiết tiền thuê
    await rentDetail.save();

    // Ẩn lịch sử thanh toán liên quan
    await PaymentHistory.updateMany(
      { rentDetail: rentDetail._id },
      { $set: { isHidden: true } }
    );
  }

  // Gửi email thông báo
  const lodgerUser = await LodgerUser.findById(contract.lodger);
  if (!lodgerUser) {
    throw new NotFoundError("Lodger user not found");
  }

  const ownerUser = await OwnerUser.findById(req.user.userId);

  //email details
  const to = lodgerUser.email;
  const from = ownerUser.email;
  const subject = `Chấm dứt hợp đồng phòng ${room.title}`;
  const body = `
    <p>Xin chào ${lodgerUser.lastName} ${lodgerUser.firstName},</p>  
    <p> Tôi là ${ownerUser.lastName} ${ownerUser.firstName}, đại diện bên cho thuê </p>
    <p>Tôi viết cho bạn thư này để thông báo về việc chấm dứt hợp đồng phòng <strong>${room.title}</strong>.</p>
    <p>Hợp đồng sẽ được chấm dứt thành công cùng với chi tiết tiền thuê và lịch sử thanh toán liên quan.</p>
    <p>Xin lưu ý rằng bạn phải rời khỏi phòng trong vòng 7 ngày. Chúng tôi sẽ tiến hành kiểm tra phòng lần cuối để đảm bảo rằng nó ở trong tình trạng giống như khi bạn chuyển đến, với mức độ hao mòn chấp nhận được. Bất kỳ thiệt hại hay thay đổi vượt quá mức hợp đồng bạn sẽ phải bồi thường dựa trên chi phí sửa chữa thực tế.</p>
   <p>Cảm ơn bạn đã đồng hành cùng chúng tôi trong suốt thời gian qua</p>
    <p>..............................</p>
    <p>Trân trọng,</p>
    <p>${ownerUser.lastName} ${ownerUser.firstName}</p>
    <p>${ownerUser.email} </p>
    <p>${ownerUser.phoneNumber} </p>`;

  //send email to lodger user that contract has been deleted
  await sendEmail(to, from, subject, body);

  res.json({ message: "Hợp đồng chấm dứt thành công", success: true });
};

/**
 * @description Get All Owner's Contracts
 * @route GET /api/contract/owner/allContracts
 * @returns
 */
const getOwnerAllContracts = async (req, res) => {
  const allContracts = await Contract.find({
    owner: req.user.userId,
    status: "Active",
    isHidden: false,
  })
    .populate({
      path: "room",
      select: "title _id",
    })
    .populate({
      path: "lodger",
      select: "_id firstName lastName",
    });

  res.json({ allContracts });
};

/**
 * @description Get the active rental rooms of the lodger user
 * @route GET /api/contract/lodgerUser/allRentalRooms
 * @returns room details
 */
const getAllLodgerRentalRooms = async (req, res) => {
  const allRentalRooms = await Contract.find({
    lodger: req.user.userId,
    status: "Active",
    isHidden: false,
  }).populate({
    path: "room",
    select: "title address category slug roomImages price",
    populate: {
      path: "roomOwner",
      model: "OwnerUser",
      select: "-createdAt -updatedAt -__v -contacts",
    },
  });

  res.json({ allRentalRooms, count: allRentalRooms.length });
};

/**
 * @description Get the contract details for the lodger user using the real estate id
 * @route GET /api/contract/lodger/:roomId
 * @returns {object} 200 - An object containing the contract details
 */
const getLodgerContractDetail = async (req, res) => {
  const contractDetail = await Contract.findOne({
    room: req.params.roomId,
    lodger: req.user.userId,
    status: "Active",
    isHidden: false,
  })
    .populate({
      path: "room",
      select: "title address category slug",
    })
    .populate({
      path: "owner",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "lodger",
      select: "firstName lastName",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

export {
  createContract,
  getContractDetailLodgerView,
  approveContract,
  getContractDetailOwnerView,
  deleteContract,
  getOwnerAllContracts,
  getAllLodgerRentalRooms,
  getLodgerContractDetail,
};
