import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema(
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
    startDate: {
      type: String,
      required: [true, "Please provide a start date"],
    },

    rentAmount: {
      type: Number,
      required: [true, "Please provide a rent amount"],
    },
    contractTerm: {
      type: Number,
      min: [1, "Contract term must be at least 1 month"], // Giá trị tối thiểu là 1
      max: [24, "Contract term cannot exceed 24 months"], // Giá trị tối đa là 24
      required: [true, "Please provide a contract term"], // Bắt buộc phải có giá trị
      default: 1, // Giá trị mặc định là 1
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive", "Pending"],
        message: "{VALUE} is not supported",
      },
      default: "Pending",
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contract", ContractSchema);
