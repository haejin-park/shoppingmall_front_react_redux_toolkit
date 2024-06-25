import {createSlice, isAnyOf} from '@reduxjs/toolkit';
import { productActions } from '../actions/productAction';  

const initialState = {
  loading: false,
  error: '',
  mainProductList:[],
  mainTotalPageNum: 1,
  mainCurrentPage: 1,
  adminProductList: [],
  adminTotalPageNum: 1,
  adminCurrentPage: 1,
  selectedProduct: {},
  product: {},
  mainSortBy: 'popularity',
  adminSortBy: 'latest'
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers:{
    changePageOfMainProduct: (state, action) => {
      state.loading = false;
      state.error = '';
      state.mainCurrentPage = action.payload;
    },
    changePageOfAdminProduct: (state, action) => {
      state.loading = false;
      state.error = '';
      state.adminCurrentPage = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.loading = false;
      state.error = '';
      state.selectedProduct = action.payload;
    },
    selectSortByMainProductList: (state,action) => {
      state.loading = false;
      state.error = '';
      state.mainSortBy = action.payload;
    },
    selectSortByAdminProductList: (state, action) => {
      state.loading = false;
      state.error = '';
      state.adminSortBy = action.payload;
    },
    deleteProductError: (state) => {
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(productActions.getMainProductList.fulfilled, 
      (state, action) => {
        state.loading =  false;
        state.error = '';
        state.mainProductList = action.payload.productList;
        state.mainTotalPageNum = action.payload.totalPageNum;
        state.mainCurrentPage = action.payload.currentPage;
        state.mainSortBy = action.payload.sortBy;
      }
    ) 
    .addCase(productActions.getAdminProductList.fulfilled, 
      (state, action) => {
        state.loading =  false;
        state.error = '';
        state.adminProductList = action.payload.productList;
        state.adminTotalPageNum = action.payload.totalPageNum;
        state.adminCurrentPage = action.payload.currentPage;
        state.adminSortBy = action.payload.sortBy;
      }
    ) 
    .addCase(productActions.getProductDetail.fulfilled, 
      (state, action)=> {
        state.loading = false;
        state.error = '';
        state.product = action.payload.product;
      }
    )
    .addMatcher(
      isAnyOf(
        productActions.createProduct.pending,
        productActions.updateProduct.pending,
        productActions.deleteProduct.pending,
        productActions.getMainProductList.pending, 
        productActions.getAdminProductList.pending,
        productActions.getProductDetail.pending,
      ),
      (state) => {
        state.loading = true;
        state.error = '';
      }
    )
    .addMatcher(
      isAnyOf(
        productActions.createProduct.rejected,
        productActions.updateProduct.rejected,
        productActions.deleteProduct.rejected,
        productActions.getMainProductList.rejected, 
        productActions.getAdminProductList.rejected,
        productActions.getProductDetail.rejected,
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    )
    .addMatcher(
      isAnyOf(
        productActions.createProduct.fulfilled,
        productActions.updateProduct.fulfilled,
        productActions.deleteProduct.fulfilled,
      ), (state) => {
        state.loading = false;
        state.error =  '';
      }
    )
  }
});

export const productSliceActions = productSlice.actions;
export default productSlice.reducer;
