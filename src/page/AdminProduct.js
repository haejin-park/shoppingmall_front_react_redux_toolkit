import React, { useEffect, useState } from "react";
import { Button, Container, Dropdown, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigationType, useSearchParams } from "react-router-dom";
import ProductDetailDialog from "../component/ProductDetailDialog";
import ProductTable from "../component/ProductTable";
import SearchBox from "../component/SearchBox";
import * as types from '../constants/product.constants';
import "../style/adminProduct.style.css";
import { transformEnglishSortBy } from "../utils/sortBy";
import { productSliceActions } from "../redux/reducers/productReducer";
import { productActions } from "../redux/actions/productAction";
const AdminProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, adminProductList:productList, adminTotalPageNum:totalPageNum, adminCurrentPage:currentPage, adminSortBy: sortBy} = useSelector((state) => state.product); 
  const [showDialog, setShowDialog] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mode, setMode] = useState("new");
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const navigationType = useNavigationType();
  const prevAdminSortBy = sessionStorage.getItem("prevAdminSortBy");
  
  useEffect(() => { 
    if(navigationType === "POP" && prevAdminSortBy) {
      let sortBy = prevAdminSortBy;
      dispatch(productSliceActions.selectSortByAdminProductList({sortBy}));
      dispatch(productActions.getAdminProductList({searchKeyword, currentPage, sortBy: prevAdminSortBy}));
    } else if(navigationType !== "POP"){
      dispatch(productActions.getAdminProductList({searchKeyword, currentPage, sortBy}));
    }
  }, [navigationType, query, searchKeyword, currentPage, dispatch, sortBy, totalPageNum, prevAdminSortBy]);

  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`)
  }, [searchKeyword, currentPage, navigate]);

  const deleteItem = (id) => {
    dispatch(productActions.deleteProduct({id,query:{searchKeyword, currentPage, sortBy}}));
  };

  const openEditForm = (product) => {
    dispatch(productSliceActions.setSelectedProduct(product))
    setMode('edit');
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    setMode('new');
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    dispatch(productSliceActions.changePageOfMainProduct(selected + 1));
  };

  const selectSortBy = (value) => {
    const sortBy = transformEnglishSortBy(value)
    sessionStorage.setItem("prevAdminSortBy", sortBy);
    dispatch(productSliceActions.selectSortByAdminProductList(sortBy));
  }

  return (
    <div className="locate-center">
      <Container>
        {loading && (
          <div className="spinner-box">
          <Spinner animation="border" role="status">
            <span className="visually-hidden loading-message">Loading...</span>
          </Spinner>
        </div>
        )}
        <div className="admin-product-div">
          <div className="admin-product-search-box">
            <SearchBox 
              placeholder="상품명 검색"
              searchValue={searchValue} 
              setSearchValue={setSearchValue}
            />
          </div>
          <div className="admin-dropdown-and-button">
           <Dropdown
              className="admin-side-sort-by-dropdown sort-by"
              align="start"
              onSelect={(value) => selectSortBy(value)}
            >
              <Dropdown.Toggle id="dropdown-basic" align="start">
                정렬 
              </Dropdown.Toggle>
              <Dropdown.Menu>
              {types.SORT_BY.map((sort, index) => (
                <Dropdown.Item key={index} eventKey={sort}>{sort}</Dropdown.Item>
              ))}
              </Dropdown.Menu> 
            </Dropdown>
            <Button className="product-add-btn" onClick={handleClickNewItem}>
              추가
            </Button>
          </div>
        </div>
        <ProductTable
          header={types.productTableHeader}
          productList={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
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
      </Container>
      <ProductDetailDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        sortBy={sortBy}
      />
    </div>
  );
};

export default AdminProduct;
