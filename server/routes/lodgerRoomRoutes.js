import express from "express";
const router = express.Router();
import {
  getAllRooms,
  getSingleRoom,
  saveRoomToggle,
  getAllSavedRooms,
} from "../controllers/lodgerRoomControllers.js";

/**
 * @description Get all rooms
 * @route GET /api/lodger/tro-so
 */
router.get("/", getAllRooms);

/**
 * @description Get single room
 * @route GET /api/lodger/tro-so/:slug
 */
router.get("/:slug", getSingleRoom);

/**
 * @description Toggle save room for lodger user
 * @route PATCH /api/lodger/tro-so/save/:id
 */
router.patch("/save/:id", saveRoomToggle);

/**
 * @description Get all saved rooms
 * @route GET /api/lodger/tro-so/save/all
 */
router.get("/saved/all", getAllSavedRooms);

export default router;
