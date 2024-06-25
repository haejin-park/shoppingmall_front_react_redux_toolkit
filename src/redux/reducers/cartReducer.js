
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { cartActions } from '../actions/cartAction';

const initialState = {
  loading: false,
  error: '',
  cartList: [],
  currentPage: 1,
  totalPageNum: 1,
  cartItemCount: 0,
  selectedItem: {},
  checkedItemList: [],
  checkedItemTotalPrice: 0,
  checkedAll: false,
};
const cartSlice = createSlice({
  name:'cart',
  initialState,
  reducers:{
    changePageOfCart: (state, action) => {
      state.loading = false;
      state.error = '';
      state.currentPage = action.payload
    },
    setSelectedCartItem: (state, action) => {
      state.loading = false;
      state.error = '';
      state.selectedItem = action.payload
    },
    checkedCartItem: (state, action) => {
      state.loading = false;
      state.error = '';
      state.checkedItemList = action.payload.checkedItemList;
      state.checkedItemTotalPrice = action.payload.checkedItemTotalPrice
    },
    checkedAll: (state, action) => {
      state.loading = false;
      state.error = '';
      state.checkedAll = action.payload
    },
  }, 
  extraReducers:(builder) => {
    builder
    .addCase(cartActions.getCartList.fulfilled, 
      (state,action) => {
        state.loading = false;
        state.error = '';
        state.cartList = action.payload.cartList;
        state.totalPageNum = action.payload.totalPageNum;
        state.currentPage = action.payload.currentPage;
      }
    )
    .addMatcher(
      isAnyOf(
        cartActions.addToCart.pending,
        cartActions.getCartList.pending,
        cartActions.deleteCartItem.pending,
        cartActions.deleteCartItemList.pending,
        cartActions.updateCartItemQty.pending,
        cartActions.getCartItemCount.pending
      ),
      (state)=>{
        state.loading = true;
        state.error = ''
      }
    )
    .addMatcher(
      isAnyOf(
        cartActions.addToCart.rejected,
        cartActions.getCartList.rejected,
        cartActions.deleteCartItem.rejected,
        cartActions.deleteCartItemList.rejected,
        cartActions.updateCartItemQty.rejected,
        cartActions.getCartItemCount.rejected
      ),
      (state)=>{
        state.loading = false;
        state.error = ''
      }
    )
    .addMatcher(
      isAnyOf(
        cartActions.addToCart.fulfilled,
        cartActions.deleteCartItem.fulfilled,
        cartActions.deleteCartItemList.fulfilled,
        cartActions.updateCartItemQty.fulfilled,
        cartActions.getCartItemCount.fulfilled
      ),
      (state, action)=>{
        state.loading = false;
        state.error = '';
        state.cartItemCount = action.payload
      }
    )
  }
});

export const cartSliceActions = cartSlice.actions;
export default cartSlice.reducer;
