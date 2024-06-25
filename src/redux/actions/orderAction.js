import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { cartActions } from './cartAction';
import { commonUiSliceActions } from '../reducers/commonUiReducer';  
const createOrder = createAsyncThunk(
  'product/createOrder',
  async({orderList, cartOrderStatus, navigate}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.post('/order', {orderList, cartOrderStatus})
      if(response.status !== 200) throw new Error(response.message);
      dispatch(cartActions.getCartItemCount(response.data.cartItemCount));
      navigate('/order/complete');
      return response.data;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}))
      return rejectWithValue(error.message);
    }
  }
);

const getOrderList = createAsyncThunk(
  'product/getOrderList',
  async({query, mode}, {rejectWithValue, dispatch}) => {
    try {
      const options = {params: {...query}};
      options.params.mode = mode;
      const response = await api.get("/order", options);
      if(response.status !== 200) throw new Error(response.message);
      return response.data;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}))
      return rejectWithValue(error.message);
    }
  }
);

const updateOrder = createAsyncThunk(
  'product/updateOrder',
  async({id, orderItemIdList, orderStatusList, orderStatusReasonList, query, mode}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.put(`/order/${id}`,{orderItemIdList, orderStatusList, orderStatusReasonList});
      if(response.status !== 200) throw new Error(response.message);
      dispatch(commonUiSliceActions.showToastMessage({message:"주문 상태 수정을 완료했습니다.", status:"success"}));
      dispatch(orderActions.getOrderList({query, mode}));
      return response.data;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}))
      return rejectWithValue(error.message);
    }
  }
);

export const orderActions = {
  createOrder,
  getOrderList,
  updateOrder,
};
