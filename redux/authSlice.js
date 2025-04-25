import { createSlice } from "@reduxjs/toolkit";




const authSlice = createSlice({
  name : 'auth',
  initialState : {token : null, isLogin : false , user: null},
  reducers :{
    loginReducer : (state, action) => {
      state.token = action.payload.token;     
      state.user = action.payload.user;       
      state.isLogin = true;
    }
    ,
    logoutReducer : (state) => {
      state.token = null;
      state.isLogin = false;
      state.user = null;
    }
  }
});

export const {loginReducer, logoutReducer} = authSlice.actions;
export default authSlice;