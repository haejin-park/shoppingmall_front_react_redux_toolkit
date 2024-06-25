
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { orderActions } from '../actions/orderAction';

const initialState = {
  loading: false,
  error: '',
  orderList: [],
  orderItemList: [],
  totalPrice: 0,
  cartOrderStatus: false,
  totalPageNum: 1,
  currentPage:1,
  selectedOrder: {},
  order: {},
};

const orderSlice = createSlice({
  name:'order',
  initialState,
  reducers:{
    saveOrderItem:(state,action) => {
      state.loading = false;
      state.error = '';
      state.orderItemList = action.payload.orderItemList;
      state.totalPrice = action.payload.totalPrice;
      state.cartOrderStatus = action.payload.cartOrderStatus;
    },
    changePageOfOrder:(state,action) => {
      state.loading = false;
      state.error = '';
      state.currentPage = action.payload;
    },
    setSelectedOrder:(state,action) => {
      state.loading = false;
      state.error = '';
      state.selectedOrder = action.payload;
    },
  }, 
  extraReducers: (builder)=> {
    builder
    .addCase(
      orderActions.createOrder.fulfilled
      ,(state, action) => {
        state.loading = false;
        state.error = '';
        state.orderNum = action.payload.orderNum;
      }
    )
    .addCase(
      orderActions.getOrderList.fulfilled
      ,(state, action) => {
        state.loading = false;
        state.error = '';
        state.orderList = action.payload.orderList;
        state.totalPageNum = action.payload.totalPageNum;
        state.currentPage = action.payload.currentPage
    })
    .addCase(
      orderActions.updateOrder.fulfilled
      ,(state) => {
        state.loading = false;
        state.error = '';
    })
    .addMatcher(
      isAnyOf(
        orderActions.createOrder.pending,
        orderActions.getOrderList.pending,
        orderActions.updateOrder.pending
      ),
      (state) => {
        state.loading = true;
        state.error = '';
      }
    )
    .addMatcher(
      isAnyOf(
        orderActions.createOrder.rejected,
        orderActions.getOrderList.rejected,
        orderActions.updateOrder.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    )
  }
});

export const orderSliceActions = orderSlice.actions;
export default orderSlice.reducer;
