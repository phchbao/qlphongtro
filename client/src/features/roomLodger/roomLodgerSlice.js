import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getAllRoom = createAsyncThunk(
  "getAllRoom",
  async ({ page, category, search, priceFilter, province, district }, thunkAPI) => {
    try {
      let url = `/lodger/tro-so?page=${page}&category=${category}`;
      if (search) {
        url = url + `&search=${search}`;
      }
      if (priceFilter) {
        url = url + `&priceFilter=${priceFilter}`;
      }
      if (province) {
        url = url + `&province=${province}`;
      }
      if (district) {
        url = url + `&district=${district}`;
      }
      const { data } = await axiosFetch.get(url);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getSingleRoom = createAsyncThunk(
  "getSingleRoom",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/lodger/tro-so/${slug}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const saveOrUnSaveRoom = createAsyncThunk(
  "saveOrUnSaveRoom",
  async ({ id }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(`/lodger/tro-so/save/${id}`);
      localStorage.setItem("user", JSON.stringify(data.updatedUser));
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllSavedRoom = createAsyncThunk(
  "getAllSavedRoom",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/lodger/tro-so/saved/all");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const sendEmailToOwner = createAsyncThunk(
  "sendEmailToOwner",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/sendEmail", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllLodgerRentalRooms = createAsyncThunk(
  "getAllLodgerRentalRooms",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(
        "/contract/lodgerUser/allRentalRooms"
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const sendComplaintToOwner = createAsyncThunk(
  "sendComplaintToOwner",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/sendEmail", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const roomLodgerSlice = createSlice({
  name: "roomLodger",
  initialState: {
    allRoom: null,
    room: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    isSaved: null,
    numberOfPages: null,
    isProcessing: false,
    allRentalRooms: null,
    success: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRoom = action.payload.allRoom;
        state.numberOfPages = action.payload.numberOfPages;
        state.alertFlag = false;
      })
      .addCase(getAllRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getSingleRoom.pending, (state) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getSingleRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.room = action.payload.room;
        state.isSaved = action.payload.isSaved;
        state.alertFlag = false;
      })
      .addCase(getSingleRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(saveOrUnSaveRoom.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(saveOrUnSaveRoom.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.isSaved = action.payload.isSaved;
        state.alertMsg = action.payload.message;
        state.alertType = "success";
      })
      .addCase(saveOrUnSaveRoom.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllSavedRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSavedRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRoom = action.payload.savedRooms;
        state.alertFlag = false;
      })
      .addCase(getAllSavedRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(sendEmailToOwner.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(sendEmailToOwner.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = "Email đã gửi thành công!";
        state.alertType = "success";
      })
      .addCase(sendEmailToOwner.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllLodgerRentalRooms.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllLodgerRentalRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRentalRooms = action.payload.allRentalRooms;
        state.alertFlag = false;
      })
      .addCase(getAllLodgerRentalRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(sendComplaintToOwner.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(sendComplaintToOwner.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = "Tin nhắn đã gửi thành công";
        state.alertType = "success";
        state.success = true;
      })
      .addCase(sendComplaintToOwner.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = roomLodgerSlice.actions;

export default roomLodgerSlice.reducer;
