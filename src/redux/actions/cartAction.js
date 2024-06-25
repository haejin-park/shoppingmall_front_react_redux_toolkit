import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { commonUiSliceActions } from '../reducers/commonUiReducer';  

const addToCart = createAsyncThunk(
  'cart/addToCart',
  async({productId, selectedOptionObj}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.post("/cart", {productId, selectedOptionObj});
      if(response.status !== 200) throw new Error(response.message);
      dispatch(commonUiSliceActions.showToastMessage({message:response.data.message, status:"success"}));
      return response.data.cartItemCount;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);
    }
  }
);

const getCartList = createAsyncThunk(
  'cart/getCartList',
  async(query, {rejectWithValue, dispatch}) => {
    try {
      let options = {params: {...query}};
      const response = await api.get("/cart", options);
      if(response.status !== 200) throw new Error(response.message);
      return response.data;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);
    }
  }
);

const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async({_id, query}, {rejectWithValue, dispatch}) => {
    try {
      if(!_id) throw new Error('삭제하려는 장바구니 항목의 ID가 존재하지 않습니다.');
      const response = await api.delete(`/cart/delete/${_id}`);
      if(response.status !== 200) throw new Error(response.message);
      dispatch(commonUiSliceActions.showToastMessage({message:"장바구니 항목 삭제를 완료했습니다.", status:"success"}));
      await dispatch(cartActions.getCartList(query));
      return response.data.cartItemCount;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);
    }
  }
); 
const deleteCartItemList = createAsyncThunk(
  'cart/deleteCartItemList',
  async({deletedItemIdList, query}, {rejectWithValue, dispatch}) => {
    try {
      let response;
      for(const _id of deletedItemIdList) {
        response = await api.delete(`/cart/delete/${_id}`);
      }
      if(response.status !== 200) throw new Error(response.message);
      dispatch(commonUiSliceActions.showToastMessage({message:"장바구니 항목 삭제를 완료했습니다.", status:"success"}));
      await dispatch(cartActions.getCartList(query));
      return response.data.cartItemCount;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);
    }
  }
);

const updateCartItemQty = createAsyncThunk(
  'cart/updateCartItemQty',
  async({productId, cartItemInitialOptionObj, selectedOptionObj, query}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.put("/cart", {productId, cartItemInitialOptionObj, selectedOptionObj});
      if(response.status !== 200) throw new Error(response.message);
      dispatch(commonUiSliceActions.showToastMessage({message:response.data.message, status:"success"}));
      await dispatch(cartActions.getCartList(query));
      return response.data.cartItemCount;
    } catch(error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);
    }
  }
);

const getCartItemCount = createAsyncThunk(
  'cart/getCartItemCount',
  async(cartItemCount, {rejectWithValue}) => {
    try {
      if(!cartItemCount) {
        const response = await api.get(`/cart/qty`);
        if(response.status !== 200) throw new Error(response.message);
        return response.data.cartItemCount;
      } else {
        return cartItemCount;
      }
    } catch(error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cartActions = {
  addToCart,
  getCartList,
  deleteCartItem,
  deleteCartItemList,
  updateCartItemQty,
  getCartItemCount,
};
