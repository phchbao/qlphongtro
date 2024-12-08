import express from "express";
const router = express.Router();
import {
  getSingleRentDetailsLodgerView,
  getAllPaymentHistory,
} from "../controllers/rentDetailLodgerControllers.js";

/**
 * @description Get Single Rent Detail for lodger user
 * @route GET /api/rentDetailLodger/:roomId
 */
router.get("/:roomId", getSingleRentDetailsLodgerView);

/**
 * @description Get All Payment History for lodger user
 * @route GET /api/rentDetailLodger/allPaymentHistory/:rentDetailId
 */
router.get("/allPaymentHistory/:rentDetailId", getAllPaymentHistory);
export default router;
