import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getSingleRentDetailLodgerView = createAsyncThunk(
  "getSingleRentDetailLodgerView",
  async ({ roomId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(
        `/rentDetailLodger/${roomId}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllPaymentHistory = createAsyncThunk(
  "getAllPaymentHistoryLodger",
  async ({ rentDetailId, page }, thunkAPI) => {
    try {
      let url = `/rentDetailLodger/allPaymentHistory/${rentDetailId}?page=${page}`;
      const { data } = await axiosFetch.get(url);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const rentDetailLodgerSlice = createSlice({
  name: "rentDetailLodger",
  initialState: {
    rentDetail: null,
    allPaymentHistory: null,
    numberOfPages: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    isProcessing: false,
    isRentPaid: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleRentDetailLodgerView.pending, (state, action) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getSingleRentDetailLodgerView.fulfilled, (state, action) => {
        state.rentDetail = action.payload.rentDetail;
        state.isRentPaid = action.payload.rentStatus;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getSingleRentDetailLodgerView.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllPaymentHistory.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(getAllPaymentHistory.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = false;
        state.allPaymentHistory = action.payload.allPaymentHistory;
        state.numberOfPages = action.payload.numberOfPages;
      })
      .addCase(getAllPaymentHistory.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = rentDetailLodgerSlice.actions;
export default rentDetailLodgerSlice.reducer;
