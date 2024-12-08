import express from "express";
const router = express.Router();
import {
  createContract,
  getContractDetailLodgerView,
  approveContract,
  getContractDetailOwnerView,
  deleteContract,
  getOwnerAllContracts,
  getAllLodgerRentalRooms,
  getLodgerContractDetail,
} from "../controllers/contractControllers.js";
import {
  authorizeOwnerUser,
  authorizeLodgerUser,
} from "../middleware/userAuthorization.js";
/**
 * @description Create a contract
 * @route POST /api/contract
 */
router.post("/", authorizeOwnerUser, createContract);

/**
 * @description Get the contract details for the lodger user
 * @route GET /api/contract/lodgerView/:contractId
 */
router.get(
  "/lodgerView/:contractId",
  authorizeLodgerUser,
  getContractDetailLodgerView
);

/**
 * @description Approve the contract
 * @route PATCH /api/contract/approve/:contractId
 */
router.patch("/approve/:contractId", authorizeLodgerUser, approveContract);

/**
 * @description Get the contract details for the owner user
 * @route GET /api/contract/ownerView/:roomId
 */
router.get(
  "/ownerView/:roomId",
  authorizeOwnerUser,
  getContractDetailOwnerView
);

/**
 * @description Delete a contract
 * @route DELETE /api/contract/delete/:contractId
 */
router.delete("/delete/:contractId", authorizeOwnerUser, deleteContract);

/**
 * @description Get All Owner's Contracts
 * @route GET /api/contract/owner/allContracts
 */
router.get("/owner/allContracts", authorizeOwnerUser, getOwnerAllContracts);

/**
 * @description Get the active rental rooms of the lodger user
 * @route GET /api/contract/lodgerUser/allRentalRooms
 */
router.get(
  "/lodgerUser/allRentalRooms",
  authorizeLodgerUser,
  getAllLodgerRentalRooms
);

/**
 * @description Get the contract details for the lodger user using the real estate id
 * @route GET /api/contract/lodger/:roomId
 */
router.get(
  "/lodger/:roomId",
  authorizeLodgerUser,
  getLodgerContractDetail
);

export default router;
