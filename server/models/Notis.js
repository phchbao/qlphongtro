import mongoose from "mongoose";

const NotiSchema = new mongoose.Schema(
  {
    notiUsers: {
      type: Array,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Noti", NotiSchema);
