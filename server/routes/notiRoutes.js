import express from "express";
const router = express.Router();
import {
  authorizeOwnerUser,
  authorizeLodgerUser,
} from "../middleware/userAuthorization.js";

import { sendMessage, getMessages } from "../controllers/notiController.js";

/**
 * @description send message route for owner user
 * @route POST /api/noti/owner/send-message
 */
router.post("/owner/send-message", authorizeOwnerUser, sendMessage);

/**
 * @description get all messages route for owner user
 * @route POST /api/noti/owner/get-messages
 */
router.post("/owner/get-messages", authorizeOwnerUser, getMessages);

/**
 * @description send message route for lodger user
 * @route POST /api/noti/lodger/send-message
 */
router.post("/lodger/send-message", authorizeLodgerUser, sendMessage);

/**
 * @description get all messages route for lodger user
 * @route POST /api/noti/lodger/get-messages
 */
router.post("/lodger/get-messages", authorizeLodgerUser, getMessages);

export default router;
