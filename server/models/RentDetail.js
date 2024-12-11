import mongoose from "mongoose";

const RentDetailSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "OwnerUser",
      required: true,
    },
    lodger: {
      type: mongoose.Types.ObjectId,
      ref: "LodgerUser",
      required: true,
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    contractTerm: {
      type: Number,
      min: [1, "Contract term must be at least 1 month"], // Giá trị tối thiểu là 1
      max: [24, "Contract term cannot exceed 24 months"], // Giá trị tối đa là 24
      required: [true, "Please provide a contract term"], // Bắt buộc phải có giá trị
      default: 1, // Giá trị mặc định là 1
    },
    startDate: {
      type: String,
      required: [true, "Please provide a start date"],
    },
    currentRentDate: {
      from: {
        type: String,
        required: [true, "Please provide a start date"],
      },
      to: {
        type: String,
        required: [true, "Please provide an end date"],
      },
    },
    electric: {
      type: Number,
      required: [true, "Nhập số kWh điện"],
      min: [0, "Số điện không bé hơn 0"],
    },
    water: {
      type: Number,
      required: [true, "Nhập số m3 nước"],
      min: [0, "Số nước không bé hơn 0"],
    },
    service: {
      type: Number,
      required: [true, "Nhập giá dịch vụ"],
      min: [0, "Giá dịch vụ không bé hơn 0"],
    },
    electricPrice: {
      type: Number,
      default: 2000, // Giá mặc định là 2000
      required: [true, "Nhập giá điện"],
      min: [1893, "Giá điện không bé hơn mức quy định (1893đ/kWh)"],
      max: [2880, "Giá điện không lớn hơn mức quy định (2880đ/kWh)"],
    },
    waterPrice: {
      type: Number,
      default: 25000, // Giá mặc định là 12000
      required: [true, "Nhập giá nước"],
      min: [8509, "Giá nước không bé hơn mức quy định (1893đ/m3)"],
      max: [27051, "Giá nước không lớn hơn mức quy định (2880đ/m3)"],
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//check if rent is paid for current month
RentDetailSchema.methods.isRentPaid = async function () {
  const PaymentHistory = mongoose.model("PaymentHistory"); // Thay bằng tên model lịch sử thanh toán
  const payment = await PaymentHistory.findOne({
    rentDetail: this._id,
    isHidden: false, // Chỉ lấy các bản ghi hợp lệ
    amountPaid: { $gt: 0 }, // Đảm bảo có thanh toán
  });

  return !!payment; // Trả về true nếu có bản ghi thanh toán hợp lệ, ngược lại trả về false
};

export default mongoose.model("RentDetail", RentDetailSchema);
