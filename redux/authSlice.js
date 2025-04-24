import { createSlice } from "@reduxjs/toolkit";




const authSlice = createSlice({
  name : 'auth',
  initialState : {token : null, isLogin : false},
  reducers :{
    loginReducer : (state, action) => {
      state.token = action.payload;
      state.isLogin = true;
    },
    logoutReducer : (state) => {
      state.token = null;
      state.isLogin = false;
    }
  }
});

export const {loginReducer, logoutReducer} = authSlice.actions;
export default authSlice;