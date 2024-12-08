import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import roomOwnerReducer from "../features/roomOwner/roomOwnerSlice";
import roomLodgerReducer from "../features/roomLodger/roomLodgerSlice";
import lodgerUserReducer from "../features/lodgerUser/lodgerUserSlice";
import ownerUserReducer from "../features/ownerUser/ownerUserSlice";
import rentDetailOwnerReducer from "../features/rentDetailOwner/rentDetailOwnerSlice";
import rentDetailLodgerReducer from "../features/rentDetailLodger/rentDetailLodgerSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    lodgerUser: lodgerUserReducer,
    ownerUser: ownerUserReducer,
    roomOwner: roomOwnerReducer,
    roomLodger: roomLodgerReducer,
    rentDetailOwner: rentDetailOwnerReducer,
    rentDetailLodger: rentDetailLodgerReducer,
  },
});
