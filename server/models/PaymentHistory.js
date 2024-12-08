import mongoose from "mongoose";

const PaymentHistorySchema = new mongoose.Schema(
  {
    rentDetail: {
      type: mongoose.Types.ObjectId,
      ref: "RentDetail",
      required: true,
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
    amountPaid: {
      type: Number,
      required: [true, "Please provide an amount paid"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["Trực tiếp", "Chuyển khoản"],
        message: "{VALUE} is not supported",
      },
      required: [true, "Please provide a payment method"],
      default: "Trực tiếp",
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentHistory", PaymentHistorySchema);
