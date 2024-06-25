import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { userActions } from '../actions/userAction';
const initialState = {
  loading: false,
  error: '',
  user: null,
  token: ''
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    deleteUserError: (state) => {
      state.error = '';
    }    
  }, 
  extraReducers: (builder) =>  {
    builder
    .addCase(userActions.registerUser.fulfilled, 
      (state) => {
        state.loading = false;
        state.error = '';
      }
    )
    .addCase(userActions.loginWithToken.fulfilled, 
      (state, action) => {
        state.loading = false;
        state.error = '';
        state.user = action.payload.user;
      }
    )
    .addCase(
      userActions.logout.fulfilled, 
      (state) => {
        state.user = null;
        state.token = ''
      }
    )
    .addMatcher(
      isAnyOf(
        userActions.loginWithEmail.pending,
        userActions.loginWithGoogle.pending,
        userActions.registerUser.pending,
        userActions.loginWithToken.pending
      ), 
      (state) => {
        state.loading = true;
        state.error = '';
      }
    )
    .addMatcher(
      isAnyOf(
        userActions.loginWithEmail.rejected,
        userActions.loginWithGoogle.rejected,
        userActions.registerUser.rejected,
        userActions.loginWithToken.rejected
      ), 
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    )
    .addMatcher(
      isAnyOf(
        userActions.loginWithEmail.fulfilled,
        userActions.loginWithGoogle.fulfilled
      ),
      (state, action)=> {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      }
    )
  }
});

export const userSliceActions = userSlice.actions;
export default userSlice.reducer;
