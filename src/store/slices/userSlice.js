import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isSubscribed: false,
};

const UserSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.user = action.payload.userData;
      state.token = action.payload.token;
      state.isSubscribed = action.payload.isSubscribed;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isSubscribed = [];
    },
  },
});

export const { setUserDetails, logout } = UserSlice.actions;
export const selectAuthState = (state) => state.auth;
export const selectUserDetails = (state) => state.auth.user;
export const getToken = (state) => state.auth.token;
export default UserSlice.reducer;
