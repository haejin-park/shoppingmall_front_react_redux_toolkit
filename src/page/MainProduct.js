import React, { useEffect } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigationType, useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { productActions } from "../redux/actions/productAction";
import { productSliceActions } from '../redux/reducers/productReducer';
import '../style/mainProduct.style.css';

const MainProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const {loading, error, mainProductList:productList, mainTotalPageNum:totalPageNum, mainCurrentPage:currentPage, mainSortBy:sortBy} = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const searchCategory = query.get("searchCategory") || "";
  const prevUserEmail = sessionStorage.getItem("prevUserEmail");
  const currentUserEmail = sessionStorage.getItem("currentUserEmail");
  const prevMainSortBy = sessionStorage.getItem("prevMainSortBy");


  useEffect(() => { 
    if(prevUserEmail && currentUserEmail && prevUserEmail !== currentUserEmail) { 
      dispatch(productActions.getMainProductList({searchCategory, searchKeyword, currentPage:1, sortBy:"popularity"}));
    } else if(navigationType === "POP" && !currentUserEmail && prevMainSortBy) {
      let sortBy = prevMainSortBy
      dispatch(productSliceActions.selectSortByMainProductList(sortBy));
      dispatch(productActions.getMainProductList({searchCategory, searchKeyword, currentPage, sortBy}));
    } else if(!currentUserEmail) {
      dispatch(productActions.getMainProductList({searchCategory, searchKeyword, currentPage, sortBy}));
    } 
  }, [navigationType, query, searchCategory, searchKeyword, currentPage, dispatch, sortBy, prevUserEmail, currentUserEmail, prevMainSortBy]);

  useEffect(() => {
    let params = {};
      if (!searchKeyword && !searchCategory && currentPage) {
        params = new URLSearchParams({currentPage});
      } else if(searchKeyword && !searchCategory && currentPage) {
        params = new URLSearchParams({searchKeyword, currentPage}) 
      } else if (!searchKeyword && searchCategory && currentPage) {
        params = new URLSearchParams({searchCategory, currentPage}) 
      } else if (searchKeyword && searchCategory && currentPage) {
        params = new URLSearchParams({searchCategory, searchKeyword, currentPage}) 
      } 
      const queryString = params.toString();
      navigate(`?${queryString}`); 
  }, [searchCategory, searchKeyword, currentPage, navigate]);


  const handlePageClick = ({ selected }) => {
    dispatch(productSliceActions.changePageOfMainProduct(selected + 1));
  };
  
  return (
    <div>
      <Container>
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
          {productList.length === 0 ?(
            <div className="empty">
              <h3>조회된 상품이 없습니다.</h3>
            </div>
          ) : (
            productList?.map((item) => (
              <Col md={3} sm={12} key={item._id}>
                <ProductCard item={item} /> 
              </Col>
            ))
          )}
        </Row>
        <Row className="paginate-row">
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
  )
}

export default MainProduct
