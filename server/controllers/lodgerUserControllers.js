import OwnerUser from "../models/OwnerUser.js";
import LodgerUser from "../models/LodgerUser.js";
import Room from "../models/Room.js";
import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Get Single Owner User
 * @route GET /api/lodger/owner-user/:slug
 * @returns {object} 200 - An object containing the owner user
 */
const getSingleOwnerUser = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req.user;

  const user = await OwnerUser.findOne({ slug }).select(
    "-contacts -accountVerificationToken"
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { _id: ownerId } = user;

  // Check if the owner user is in the current lodger user's contact list
  const currentLodgerUser = await LodgerUser.findById(userId);
  const isContact = currentLodgerUser.contacts.includes(ownerId.toString());

  const rooms = await Room.find({ roomOwner: user._id });

  res.json({ user, rooms, isContact });
};

/**
 * @description Get current user's details
 * @route GET /api/lodger/profile
 * @returns {object} 200 - An object containing the user
 */
const getSelfDetail = async (req, res) => {
  const user = await LodgerUser.findById(req.user.userId);
  if (!user) throw new NotFoundError("User not found");
  res.json({ user });
};

/**
 * @description Update current user's details
 * @route PATCH /api/lodger/profile
 * @returns {object} 200 - An object containing the user
 */
const updateProfile = async (req, res) => {
  const { phoneNumber, address, gender } = req.body;

  if (!address || !phoneNumber || !gender) {
    throw new BadRequestError("Please fill in all fields");
  }
  const user = await LodgerUser.findByIdAndUpdate(
    req.user.userId,
    {
      gender,
      address,
      phoneNumber,
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({ user });
};

/**
 * @description Toggle Add Contact (Add or Remove Contact)
 * @route PATCH /api/lodger/addContact/:id
 * @returns {object} 200 - An object containing the user
 */
const addContactToggle = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const ownerUser = await OwnerUser.findById(id);

  if (!ownerUser) {
    throw new NotFoundError("Owner User not found");
  }

  const currentLodgerUser = await LodgerUser.findById(userId);

  // Check if the owner user is in the current lodger user's contact list and remove them if they are
  if (currentLodgerUser.contacts.includes(id)) {
    currentLodgerUser.contacts = currentLodgerUser.contacts.filter(
      (contactId) => contactId.toString() !== id
    );
    const updatedUser = await LodgerUser.findOneAndUpdate(
      { _id: userId },
      { contacts: currentLodgerUser.contacts },
      { new: true, runValidators: true }
    );
    res.json({ updatedUser, message: "Đã hủy liên hệ", isContact: false });
  } else {
    // Add the owner user to the current lodger user's contact list
    const updatedUser = await LodgerUser.findOneAndUpdate(
      { _id: userId },
      {
        $push: { contacts: id },
      },
      { new: true, runValidators: true }
    );
    
    // Automatically add the lodger user to the owner's contact list
    const currentOwnerUser = await OwnerUser.findById(id);
    if (!currentOwnerUser.contacts.includes(userId)) {
      await OwnerUser.findByIdAndUpdate(
        id,
        { $push: { contacts: userId } },
        { new: true, runValidators: true }
      );
    }

    res.json({ updatedUser, message: "Đã thêm liên hệ", isContact: true });
  }
};

/**
 * @description Get All Contacts
 * @route PATCH /api/lodger/contacts/all
 * @returns {object} 200 - An array containing the contact users
 */
const getAllContacts = async (req, res) => {
  const { userId } = req.user;
  const { name } = req.query;

  // Get the current owner user's contact list
  const currentLodgerUser = await LodgerUser.findById(userId).populate({
    path: "contacts",
    select: "-contacts -accountVerificationToken -createdAt -updatedAt -__v",
  });

  if (!currentLodgerUser) throw new NotFoundError("User not found");

  let contacts = currentLodgerUser.contacts; // Get the current owner user's contact list
  // Filter the contact list by name if a name is provided in the query
  if (name) {
    contacts = contacts.filter((contact) => {
      return (
        contact.firstName.toLowerCase().includes(name.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(name.toLowerCase())
      );
    });
  }

  // reverse the contact list so that the most recent contact is at the top
  contacts = contacts.reverse();

  res.json({ contacts });
};

export {
  getSingleOwnerUser,
  getSelfDetail,
  updateProfile,
  addContactToggle,
  getAllContacts,
};
