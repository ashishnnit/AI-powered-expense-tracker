import {createSlice} from "@reduxjs/toolkit";

//! Initial State
const authSlice = createSlice({
  name: "auth",
  initialState:{
    user:JSON.parse(localStorage.getItem('userInfo')) || null,
  },

//! Reducers
reducers:{
    loginAction: (state, action) => {
      state.user = action.payload;
    },
    // logout
    logoutAction:(state, action) => {
      state.user = null;
    },
},

});

//! Generate actions
export const {loginAction, logoutAction} = authSlice.actions;
//! Generate the reducers
const authReducer = authSlice.reducer;
export default authReducer;