import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);

const RoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: [true, "Nhập mã phòng"],
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Nhập tên phòng"],
      trim: true,
      maxLength: [100, "Tên phòng không dài quá 100 kí tự"],
    },
    slug: {
      type: String,
      slug: "title",
      slug_padding_size: 4,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Nhập giá cho thuê"],
      min: [0, "Giá thuê không rẻ hơn 0 đồng"],
    },
    address: {
      province: {
        type: String,
        required: [true, "Nhập địa chỉ"],
      },
      district: {
        type: String,
        required: [
          true,
          "Nhập tên quận/ huyện/ thị xã, thành phố trực thuộc tỉnh (thành phố)",
        ]},
      detailAddress: {
        type: String,
        required: [true, "Nhập chi tiết địa chỉ"],
      },
    },
    description: {
      type: String,
      required: [true, "Nhập mô tả"],
      trim: true,
      maxLength: [3000, "Mô tả không dài quá 3000 kí tự"],
    },
    isHidden: {
      type: Boolean,
      default: false, // Mặc định phòng không bị ẩn
    },
    area: {
      type: Number,
      required: [true, "Nhập diện tích"],
      min: [0, "Diện tích không nhỏ hơn 0 mét vuông"],
    },
    beds: {
      type: Number,
      required: [true, "Nhập số giường"],
      min: [0, "Số lượng giường không bé hơn 0"],
    },

    amenities: [{
      type: String,
      required: [true, "Chọn dịch vụ phòng"],
      enum: ["WiFi ", "Điều hòa ", "Nhà bếp ", "Gác "],
      message: "Giá trị không thuộc danh mục trên",
  }],

    category: {
      type: String,
      required: [true, "Chọn loại phòng"],
      enum: {
        values: ["Chung cư mini", "Truyền thống", "Sleepbox", "KTX", "Homestay"],
        message: "Giá trị không thuộc danh mục trên",
      },
    },

    status: {
      type: Boolean,
      default: true,
    },

    roomImages: [Object],

    roomOwner: {
      type: mongoose.Types.ObjectId,
      ref: "OwnerUser",
      required: [true, "Hãy nhập tên chủ nhà"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
