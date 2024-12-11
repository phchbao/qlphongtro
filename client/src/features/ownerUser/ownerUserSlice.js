import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getProfileDetails = createAsyncThunk(
  "getOwnerProfileDetails",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/owner/profile");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "updateProfile",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch("/owner/profile", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getLodgerUserDetails = createAsyncThunk(
  "getLodgerUserDetails",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/owner/lodger-user/${slug}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const addOrRemoveContact = createAsyncThunk(
  "addOrRemoveContact",
  async ({ id }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(`/owner/addContact/${id}`);
      localStorage.setItem("user", JSON.stringify(data.updatedUser));
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllContacts = createAsyncThunk(
  "getAllContacts",
  async ({ name, email }, thunkAPI) => {
    try {
      let url = "/owner/contacts/all";
      const params = [];
      if (name) params.push(`name=${name}`);
      if (email) params.push(`email=${email}`);
      if (params.length) url += `?${params.join("&")}`;

      const { data } = await axiosFetch.get(url);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Lỗi không xác định");
    }
  }
);

export const createContract = createAsyncThunk(
  "createContract",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/contract", formData);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getContractOwnerView = createAsyncThunk(
  "getContractOwnerView",
  async ({ roomId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(
        `/contract/ownerView/${roomId}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const deleteContract = createAsyncThunk(
  "deleteContract",
  async ({ contractId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.delete(
        `/contract/delete/${contractId}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getOwnerAllContracts = createAsyncThunk(
  "getOwnerAllContracts",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/contract/owner/allContracts");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllContactIds = createAsyncThunk(
  "getAllContactIds",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/owner/contacts/ids");
      return data.contactIds; // API trả về danh sách ID
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Lỗi không xác định");
    }
  }
);

const ownerUserSlice = createSlice({
  name: "ownerUser",
  initialState: {
    user: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    isProcessing: false,
    isContact: null,
    contacts: null,
    contactIds: null,
    contractDetail: null,
    success: null,
    allContracts: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProfileDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.alertFlag = false;
      })
      .addCase(getProfileDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(updateProfile.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.user = action.payload.user;
        state.alertFlag = true;
        state.alertMsg = "Hồ sơ cập nhật thành công";
        state.alertType = "success";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getLodgerUserDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getLodgerUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isContact = action.payload.isContact;
        state.alertFlag = false;
      })
      .addCase(getLodgerUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(addOrRemoveContact.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(addOrRemoveContact.fulfilled, (state, action) => {
        state.alertFlag = true;
        state.isContact = action.payload.isContact;
        state.alertMsg = action.payload.message;
        state.alertType = "success";
        state.isProcessing = false;
      })
      .addCase(addOrRemoveContact.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllContacts.pending, (state) => {
        state.isLoading = true;
        state.alertFlag = false;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.contacts = action.payload.contacts;
        state.isLoading = false;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(createContract.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.success = true;
        state.alertFlag = true;
        state.alertMsg = "Hợp đồng đã tạo và gửi cho bên muốn thuê phòng";
        state.alertType = "success";
      })
      .addCase(createContract.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getContractOwnerView.pending, (state, action) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getContractOwnerView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contractDetail = action.payload.contractDetail;
        state.alertFlag = false;
      })
      .addCase(getContractOwnerView.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(deleteContract.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.success = action.payload.success;
        state.alertFlag = true;
        state.alertMsg = action.payload.message;
        state.alertType = "success";
      })
      .addCase(deleteContract.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getOwnerAllContracts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOwnerAllContracts.fulfilled, (state, action) => {
        state.allContracts = action.payload.allContracts;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getOwnerAllContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllContactIds.pending, (state) => {
        state.isLoading = true;
        state.alertFlag = false;
      })
      .addCase(getAllContactIds.fulfilled, (state, action) => {
        state.contactIds = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllContactIds.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = ownerUserSlice.actions;

export default ownerUserSlice.reducer;
