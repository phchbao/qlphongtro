import express from "express";
const router = express.Router();
import {
  getSingleOwnerUser,
  getSelfDetail,
  updateProfile,
  addContactToggle,
  getAllContacts,
} from "../controllers/lodgerUserControllers.js";

/**
 * @description Get Single Room Owner User
 * @route GET /api/lodger/owner-user/:slug
 */
router.get("/owner-user/:slug", getSingleOwnerUser);

/**
 * @description Get the current user's details
 * @route GET /api/lodger/profile
 */
router.get("/profile", getSelfDetail);

/**
 * @description Update the current user's details
 * @route PATCH /api/lodger/profile
 */
router.patch("/profile", updateProfile);

/**
 * @description Toggle Add Contact (Add or Remove Contact)
 * @route PATCH /api/lodger/addContact/:id
 */
router.patch("/addContact/:id", addContactToggle);

/**
 * @description Get All Contacts
 * @route PATCH /api/lodger/contacts/all
 */
router.get("/contacts/all", getAllContacts);

export default router;
