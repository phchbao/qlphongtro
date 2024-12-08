import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const postRoom = createAsyncThunk(
  "postRoom",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/owner/tro-so", formData);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getPersonalRoom = createAsyncThunk(
  "getPersonalRoom",
  async ({ page }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/owner/tro-so?page=${page}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllOwnerRoom = createAsyncThunk(
  "getAllOwnerRoom",
  async ({ page, status, search, }, thunkAPI) => {
    try {
      let url = `owner/tro-so?page=${page}&status=${status}`;
      if (search) {
        url = url + `&search=${search}`;
      }
      const { data } = await axiosFetch.get(url);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getRoomDetail = createAsyncThunk(
  "getRoomDetail",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/owner/tro-so/${slug}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateRoomDetail = createAsyncThunk(
  "updateRoomDetail",
  async ({ slug, formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(
        `/owner/tro-so/update/${slug}`,
        formValues
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  "deleteRoom",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.delete(
        `/owner/tro-so/delete/${slug}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const fetchRoomStats = createAsyncThunk(
  "fetchRoomStats",
  async (_, thunkAPI) => {
    try {
      console.log("Fetching room stats from API...");
      const { data } = await axiosFetch.get("/owner/manage/rooms/stats");
      console.log("API response:", data);
      return data;
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Error fetching room stats");
    }
  }
);


const roomOwnerSlice = createSlice({
  name: "room",
  initialState: {
    allRoom: null,
    room: null,
    hidden: null,
    visible: null,
    available: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    postSuccess: false,
    isProcessing: false,
    numberOfPages: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.room = action.payload.room;
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Đăng bài thành công";
        state.alertType = "success";
      })
      .addCase(postRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
        state.postSuccess = false;
      })
      .addCase(getPersonalRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPersonalRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRoom = action.payload.rooms;
        state.numberOfPages = action.payload.numberOfPages;
        state.alertFlag = false;
      })
      .addCase(getPersonalRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllOwnerRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOwnerRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRoom = action.payload.allRoom;
        state.numberOfPages = action.payload.numberOfPages;
        state.alertFlag = false;
      })
      .addCase(getAllOwnerRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getRoomDetail.pending, (state) => {
        state.isLoading = true;
        state.postSuccess = false;
      })
      .addCase(getRoomDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.room = action.payload.room;
        state.alertFlag = false;
      })
      .addCase(getRoomDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(updateRoomDetail.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(updateRoomDetail.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.room = action.payload.updatedRoom;
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Chi tiết phòng cập nhật thành công!";
        state.alertType = "success";
      })
      .addCase(updateRoomDetail.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(deleteRoom.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Xóa phòng thành công. Đang cập nhật...";
        state.alertType = "success";
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(fetchRoomStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoomStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hidden = action.payload.hidden;
        state.visible = action.payload.visible;
        state.available = action.payload.available;
        state.alertFlag = false;
      })
      .addCase(fetchRoomStats.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = roomOwnerSlice.actions;

export default roomOwnerSlice.reducer;
