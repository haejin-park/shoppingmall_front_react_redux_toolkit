import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { commonUiSliceActions } from '../reducers/commonUiReducer';  
import { productSliceActions } from '../reducers/productReducer';

const getMainProductList = createAsyncThunk(
  'product/getMainProductList',
  async(query, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.get(`/product`, {params: {...query}});
      if(response.status !== 200) throw new Error(response.message);
      return response.data;
    } catch (error) {
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);
    }
  }
);

const getAdminProductList = createAsyncThunk(
  'product/getAdminProductList',
  async(query, {rejectWithValue, dispatch}) => {
    try {   
      const response = await api.get(`/product`, {params: {...query}});
      if(response.status !== 200) throw new Error(response.message);
      return response.data;
    } catch(error){ 
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);  
    } 
  }
);

const createProduct = createAsyncThunk(
  'product/createProduct',
  async({formData,query,handleClose}, {rejectWithValue, dispatch}) => {
    try {   
      const response = await api.post("/product", formData);
      if(response.status !== 200) throw new Error(response.message);
      dispatch(commonUiSliceActions.showToastMessage({message:"상품 생성을 완료했습니다.", status:"success"}));
      handleClose(); 
      dispatch(productSliceActions.changePageOfAdminProduct(1));
      dispatch(productActions.getAdminProductList(query));
      return response.data;
    } catch(error){ 
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);  
    } 
  }
);

const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async({id, query}, {rejectWithValue, dispatch}) => {
    try {   
      if(!id) throw new Error('삭제하려는 상품의 ID가 존재하지 않습니다.');
      await api.put(`/product/delete/${id}`);
      dispatch(commonUiSliceActions.showToastMessage({message:"상품 삭제를 완료했습니다.", status:"success"}));
      dispatch(productActions.getAdminProductList(query));
    } catch(error){ 
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);  
    } 
  }
);

const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async({formData, query, handleClose}, {rejectWithValue, dispatch}) => {
    try {   
      const response = await api.put(`/product/${formData._id}`, formData);
      if(response.status !== 200) throw new Error(response.message);
      dispatch(commonUiSliceActions.showToastMessage({message:"상품 수정을 완료했습니다.", status:"success"}));
      handleClose();
      dispatch(productActions.getAdminProductList(query));
    } catch(error){ 
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);  
    } 
  }
);

const getProductDetail = createAsyncThunk(
  'product/getProductDetail',
  async(id, {rejectWithValue, dispatch}) => {
    try {   
      const response = await api.get(`/product/${id}`);
      if(response.status !== 200) throw new Error(response.message);
      return response.data;
    } catch(error){ 
      dispatch(commonUiSliceActions.showToastMessage({message:error.message, status:"error"}));
      return rejectWithValue(error.message);  
    } 
  }
);

export const productActions = {
  getMainProductList,
  getAdminProductList,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductDetail
};
