import express from "express";
const router = express.Router();
import {
  postRoom,
 // getOwnerRooms,
  getAllOwnerRooms,
  getSingleRoom,
  updateRoomDetails,
  deleteRoom,
  getRoomStats,
} from "../controllers/ownerRoomController.js";
import upload from "../middleware/multerImageMiddleware.js";
import { cloudinaryMultipleUpload } from "../middleware/cloudinaryUpload.js";

/**
 * @description Post real estate
 * @route POST /api/owner/tro-so
 */
router.post(
  "/",
  upload.array("roomImages", 10),
  cloudinaryMultipleUpload,
  postRoom
);

/**
 * @description Get Owner's personal real estates
 * @route GET /api/owner/tro-so
 */
router.get("/", getAllOwnerRooms);
//router.get("/", getOwnerRooms);

/**
 * @description Get single room
 * @route GET /api/owner/tro-so/:slug
 */
router.get("/:slug", getSingleRoom);

/**
 * @description Cập nhật chi tiết bài đăng
 * @route PATCH /api/owner/tro-so/update/:slug
 */
router.patch("/update/:slug", updateRoomDetails);

/**
 * @description Delete Room
 * @route DELETE /api/owner/tro-so/delete/:slug
 */
router.delete("/delete/:slug", deleteRoom);

router.get("/owner/manage/rooms/stats", getRoomStats);

export default router;
