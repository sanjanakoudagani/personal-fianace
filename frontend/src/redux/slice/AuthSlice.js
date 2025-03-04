import { createSlice } from "@reduxjs/toolkit";

//! Initial State
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("userInfo")) || null,
  },
  // Reducers
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload)); // ✅ Save to localStorage
    },
    logoutAction: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo"); // ✅ Clear localStorage on logout
    },
  },
});

//! Generate actions
export const { loginAction, logoutAction } = authSlice.actions;

//! Generate the reducer
const authReducer = authSlice.reducer;
export default authReducer;
