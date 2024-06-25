import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import CartProductCard from "../component/CartProductCard";
import OrderReceipt from "../component/OrderReceipt";
import SearchBox from "../component/SearchBox";
import { cartActions } from "../redux/actions/cartAction";
import { cartSliceActions } from '../redux/reducers/cartReducer';

import "../style/cart.style.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, cartList, checkedItemList, checkedAll, totalPageNum, currentPage} = useSelector((state) => state.cart);
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const [searchValue, setSearchValue] = useState("");
  const [deletedStatus, setDeletedStatus] = useState(false);
  const [deletedItemIdList, setDeletedItemIdList] = useState([]);

  useEffect(() => { 
    dispatch(cartActions.getCartList({searchKeyword, currentPage}));
  }, [query, searchKeyword, currentPage, dispatch]);

  useEffect(() => {
    if(checkedItemList.length === cartList.length) {
      dispatch(cartSliceActions.checkedAll(true));
    } else {
      dispatch(cartSliceActions.checkedAll(false));
    }
    },[checkedItemList, cartList, dispatch]); 
  

  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`); 
  }, [searchKeyword, currentPage, navigate]);
  
  useEffect(() => {
    let deletedProductStatus = cartList?.some(item => item.productData[0].isDeleted);
    setDeletedStatus(deletedProductStatus);

    let deletedItemIdList = cartList
      .filter(item => item.productData[0].isDeleted)
      .map(item => item.items._id);

    setDeletedItemIdList(deletedItemIdList);
  },[cartList, setDeletedStatus]);
    
  const handlePageClick = ({ selected }) => {
    dispatch(cartSliceActions.changePageOfCart(selected+1));
  };

  const filteredCheckedItemList = (deleteItemIdList) => {
    const updatedCheckedItemList = checkedItemList.filter((checkedItem) => {
      return !deleteItemIdList.includes(checkedItem.items._id);
    });
    const totalPrice = updatedCheckedItemList.reduce((total, item) => {
      return total + item.productData[0]?.price * item.items.qty;
    },0);
    dispatch(cartSliceActions.checkedCartItem({checkedItemList:updatedCheckedItemList, checkedItemTotalPrice:totalPrice}));
  }

  const deleteCartItemList = (checkedItemIdList) => {
    if(checkedItemIdList) { 
      dispatch(cartActions.deleteCartItemList({deletedItemIdList: checkedItemIdList, query:{searchKeyword, currentPage}}));
      filteredCheckedItemList(checkedItemIdList);
    } 
  }

  const deleteDeletedProductList = () => { 
    if(deleteCartItemList) {
      dispatch(cartActions.deleteCartItemList({deletedItemIdList,query:{searchKeyword, currentPage}}));
      filteredCheckedItemList(deletedItemIdList); 
    }
  }

  const onCheckAllItem = () =>  {
    if(checkedItemList.length === cartList.length) {
      dispatch(cartSliceActions.checkedCartItem({checkedItemList:[], checkedItemTotalPrice:0}));
    } else {
      const totalPrice = cartList.reduce((total, item) => {
        return total + item.productData[0]?.price * item.items.qty;
      },0);
      dispatch(cartSliceActions.checkedCartItem({checkedItemList:[...cartList], checkedItemTotalPrice:totalPrice}));
    }
  };

  return (
    <div>
      <Container className="cart-page-container">
        <Row className="cart-row">
          {loading && (
            <div className="spinner-box">
              <Spinner animation="border" role="status">
                <span className="visually-hidden loading-message">Loading...</span>
              </Spinner>
            </div>
          )}
          {error && (
            <div>
              <Alert variant="danger" className="error-message">
                {error}
              </Alert>
            </div>
          )}
          <Col xs={12} className="product-list-col">
            <div className="common-search-box">
              <SearchBox 
                placeholder="상품명 검색"
                searchValue={searchValue} 
                setSearchValue={setSearchValue}
              />
            </div>
            {cartList.length > 0 ?
              <>
                <div className="select-and-delete-box">
                  <Form.Check 
                    label="전체 선택" 
                    onChange={() => onCheckAllItem()} 
                    checked={checkedAll}
                  />
                  <Button variant="dark" className="mt-1" size="sm" onClick={() => deleteCartItemList(checkedItemList.map(item => item.items._id))}  disabled={checkedItemList.length <= 0}>
                    선택 삭제
                  </Button>
                </div>
                {deletedStatus &&
                  <div className="deleted-product">
                    <div className="deleted-product-message-and-btn">
                      <div className="deleted-product-message">
                        <strong>더이상 판매하지 않는 상품입니다. </strong>
                        <strong>해당 상품을 삭제하시겠습니까?</strong>
                      </div>
                      <Button className="delete-cart-item-btn" variant="dark" size="sm" onClick={() => deleteDeletedProductList(checkedItemList.map(item => item.items._id))}>
                        삭제
                      </Button>
                    </div>
                    {cartList.map((item,index) => (
                      item.productData[0].isDeleted && 
                      <CartProductCard 
                        key={`${item.items.productId}_${item.items.size}`} 
                        item={item}
                        checkedAll={checkedAll}
                      />
                    ))}
                  </div>
                }
                {cartList.map((item) => (
                  !item.productData[0].isDeleted &&
                  <CartProductCard 
                    key={item.items._id} 
                    item={item} 
                    checkedAll={checkedAll}
                  />
                ))}
              </>
            : 
            <div className="empty">
              <h3>카트가 비어있습니다.</h3>
              <div>상품을 담아주세요!</div>
            </div>
            }
          </Col>
          <Col xs={12} className="order-receipt-col">
            <OrderReceipt cartOrderStatus={true}/>
          </Col>
        </Row>
        <Row>
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={8}
            pageCount={totalPageNum}
            forcePage={currentPage - 1} 
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
