import React, { useEffect, useState } from "react";
import { Alert, Container, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderDetailDialog from "../component/OrderDetailDialog";
import OrderStatusCard from "../component/OrderStatusCard";
import SearchBox from "../component/SearchBox";
import { orderActions } from "../redux/actions/orderAction";
import { orderSliceActions } from '../redux/reducers/orderReducer';
import "../style/myOrder.style.css";

const MyOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, orderList, totalPageNum, currentPage} = useSelector((state) => state.order);
  const [query] = useSearchParams(); 
  const searchKeyword = query.get("searchKeyword") || ''; 
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(orderActions.getOrderList({query:{searchKeyword, currentPage}, mode:"customer"}));
  }, [query, searchKeyword, currentPage, dispatch]);

  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`)
  }, [searchKeyword, currentPage, navigate]);

  const handlePageClick = ({ selected }) => {
    dispatch(orderSliceActions.changePageOfOrder(selected + 1));
  };

  const openEditForm = (order) => {
    setOpen(true);
    dispatch(orderSliceActions.setSelectedOrder(order));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container className="status-card-container">
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
      <Row>
        <div className="common-search-box">
          <SearchBox 
            placeholder="상품명 검색"
            searchValue={searchValue} 
            setSearchValue={setSearchValue}
          />
        </div>
      </Row>
      <Row>
        {orderList.length <= 0
          ? 
            <div className="empty">
              <h3>주문한 상품이 없습니다.</h3>
            </div>
          : orderList?.flatMap((order, index) => (
            <OrderStatusCard 
              key={index} 
              order={order}
              openEditForm={openEditForm}
            />
          ))
        }
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
      {open && <OrderDetailDialog open={open} handleClose={handleClose} mode="customer" />}
    </Container>
  );
};

export default MyOrder;
