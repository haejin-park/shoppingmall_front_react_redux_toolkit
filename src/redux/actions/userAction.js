import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { commonUiSliceActions } from '../reducers/commonUiReducer';  

const loginWithToken = createAsyncThunk(
  'user/loginWithToken', 
  async (user,{rejectWithValue, dispatch}) => {
    try {
      const response = await api.get("/user/me");
      if(response.status !== 200) throw new Error(response.message);
      return response.data;
    } catch(error) {
      dispatch(userActions.logout(user.email));
      return rejectWithValue(error.message);
    }
  }
);
const loginWithEmail = createAsyncThunk(
  'user/loginWithEmail',
  async ({email, password, navigate}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.post('/auth/login', {email, password});
      if(response.status !== 200) throw new Error(response.message);
      sessionStorage.setItem("currentUserEmail", email);
      const prevUserEmail = sessionStorage.getItem("prevUserEmail");
      email === prevUserEmail? navigate(-1) : navigate('/');  
      sessionStorage.setItem("token", response.data.token);
      api.defaults.headers.authorization = `Bearer ${response.data.token}`;
      dispatch(commonUiSliceActions.showToastMessage({message:"로그인 되었습니다.", status:"success"}));
      setTimeout(() => {
        sessionStorage.removeItem("prevUserEmail");
        sessionStorage.removeItem("currentUserEmail");
      }, 1000); 
      return response.data;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);  
    }
  }
)

const logout = createAsyncThunk(
  'user/logout',
  async (email, {dispatch}) => {
    sessionStorage.setItem('prevUserEmail', email);
    sessionStorage.removeItem("token");
    dispatch(commonUiSliceActions.showToastMessage({message:"로그아웃 되었습니다.", status:"success"}));
  }
)

const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async ({googleToken, navigate}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.post('/auth/google', {googleToken});
      if(response.status !== 200) throw new Error(response.message);
      const prevUserEmail = sessionStorage.getItem("prevUserEmail");
      sessionStorage.setItem("currentUserEmail", response.data.user.email);
      response.data.user.email === prevUserEmail ? navigate(-1) : navigate('/');
      sessionStorage.setItem('token', response.data.token);
      api.defaults.headers.authorization = `Bearer ${response.data.token}`;
      dispatch(commonUiSliceActions.showToastMessage({message:"로그인 되었습니다.", status:"success"}));
      sessionStorage.removeItem("prevUserEmail");
      sessionStorage.removeItem("currentUserEmail");
      return response.data;
    } catch (error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);  
    }
  }
)

const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({email, name, password, navigate}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.post('/user', {email, name, password});
      if(response.status !== 200) throw new Error(response.message);
      dispatch(commonUiSliceActions.showToastMessage({message:"회원가입을 완료했습니다.", status:"success"}));
      navigate('/login');
    } catch(error) {
      return rejectWithValue(error.message);  
    }
  }
)

export const userActions = {
  loginWithToken,
  loginWithEmail,
  logout,
  loginWithGoogle,
  registerUser,
};
