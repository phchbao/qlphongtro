import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const createRentDetail = createAsyncThunk(
  "createRentDetail",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post(
        "/rentDetail/createDetail",
        formData
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllRentDetailsOwnerView = createAsyncThunk(
  "getAllRentDetailsOwnerView",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/rentDetail/allRentDetails");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getSingleRentDetailOwnerView = createAsyncThunk(
  "getSingleRentDetailOwnerView",
  async ({ rentDetailId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/rentDetail/${rentDetailId}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const sendPaymentEmailToLodger = createAsyncThunk(
  "sendPaymentEmailToLodger",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/sendEmail", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const createPaymentHistory = createAsyncThunk(
  "createPaymentHistory",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post(
        "/rentDetail/createPaymentHistory",
        formData
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllPaymentHistory = createAsyncThunk(
  "getAllPaymentHistoryOwner",
  async ({ rentDetailId, page }, thunkAPI) => {
    try {
      let url = `/rentDetail/allPaymentHistory/${rentDetailId}?page=${page}`;
      const { data } = await axiosFetch.get(url);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateElectricPrice = createAsyncThunk(
  "updateElectricPrice",
  async ({ electricPrice }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch("/rentDetail/updateElectricPrice", { electricPrice });
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateWaterPrice = createAsyncThunk(
  "updateWaterPrice",
  async ({ waterPrice }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch("/rentDetail/updateWaterPrice", { waterPrice });
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateService = createAsyncThunk(
  "updateService",
  async ({ service }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch("/rentDetail/updateService", { service });
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const rentDetailOwnerSlice = createSlice({
  name: "rentDetailOwner",
  initialState: {
    allRentDetails: null,
    rentDetail: null,
    allPaymentHistory: null,
    numberOfPages: null,
    success: null,
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
      .addCase(createRentDetail.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(createRentDetail.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.success = action.payload.success;
        state.alertFlag = true;
        state.alertMsg = action.payload.msg;
        state.alertType = "success";
      })
      .addCase(createRentDetail.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllRentDetailsOwnerView.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllRentDetailsOwnerView.fulfilled, (state, action) => {
        state.allRentDetails = action.payload.rentDetails;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getAllRentDetailsOwnerView.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getSingleRentDetailOwnerView.pending, (state, action) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getSingleRentDetailOwnerView.fulfilled, (state, action) => {
        state.rentDetail = action.payload.rentDetail;
        state.isRentPaid = action.payload.rentStatus;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getSingleRentDetailOwnerView.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(sendPaymentEmailToLodger.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(sendPaymentEmailToLodger.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = "Email đã gửi thành công!";
        state.alertType = "success";
        state.success = true;
      })
      .addCase(sendPaymentEmailToLodger.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(createPaymentHistory.pending, (state, action) => {
        state.isProcessing = true;
        state.success = null;
      })
      .addCase(createPaymentHistory.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload.msg;
        state.alertType = "success";
        state.success = true;
      })
      .addCase(createPaymentHistory.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllPaymentHistory.pending, (state, action) => {
        state.isProcessing = true;
        state.success = null;
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
      })
      .addCase(updateElectricPrice.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(updateElectricPrice.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload.msg;
        state.alertType = "success";
        state.success = true;
      })
      .addCase(updateElectricPrice.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(updateWaterPrice.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(updateWaterPrice.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload.msg;
        state.alertType = "success";
        state.success = true;
      })
      .addCase(updateWaterPrice.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(updateService.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload.msg;
        state.alertType = "success";
        state.success = true;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = rentDetailOwnerSlice.actions;
export default rentDetailOwnerSlice.reducer;
