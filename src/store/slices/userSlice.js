import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
};

const UserSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    updateUser(state, action) {
      // Merge new user data with existing user data
      state.user =  {...state.user, ...action.payload};
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUserDetails,updateUser, logout } = UserSlice.actions;
export const selectAuthState = (state) => state.auth;
export const selectUserDetails = (state) => state.auth.user;
export const getToken = (state) => state.auth.token;
export default UserSlice.reducer;
