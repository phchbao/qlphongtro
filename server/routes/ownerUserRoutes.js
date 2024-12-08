import express from "express";
const router = express.Router();

import {
  getSingleLodgerUser,
  getSelfDetail,
  updateProfile,
  addContactToggle,
  getAllContacts,
} from "../controllers/ownerUserControllers.js";

import upload from "../middleware/multerImageMiddleware.js"; // Import middleware Multer
import { cloudinaryProfileImageUpload } from "../middleware/cloudinaryUpload.js"; // Import middleware Cloudinary

/**
 * @description Get Single Lodger User
 * @route GET /api/owner/lodger-user/:slug
 */
router.get("/lodger-user/:slug", getSingleLodgerUser); // Only the lodger user can access this route

/**
 * @description Get the current user's details
 * @route GET /api/owner/profile
 */
router.get("/profile", getSelfDetail);

/**
 * @description Update the current user's details
 * @route PATCH /api/owner/profile
 */
router.patch("/profile", updateProfile);

/**
 * @description Toggle Add Contact (Add or Remove Contact)
 * @route PATCH /api/owner/addContact/:id
 */
router.patch("/addContact/:id", addContactToggle);

/**
 * @description Get All Contacts
 * @route PATCH /api/owner/contacts/all
 */
router.get("/contacts/all", getAllContacts);

export default router;
