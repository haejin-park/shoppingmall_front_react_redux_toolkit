import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  toastMessage: { message: "", status: "" },
};

const commonUiSlice = createSlice({
    name: 'commonUi',
    initialState,
    reducers:{
      showToastMessage: (state, action) => {
        state.toastMessage.message = action.payload.message;
        state.toastMessage.status = action.payload.status;
      }
    }
}) 
export const commonUiSliceActions = commonUiSlice.actions;
export default commonUiSlice.reducer;
