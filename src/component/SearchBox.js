import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useNavigationType } from "react-router";
import { useSearchParams } from "react-router-dom";
import { cartSliceActions } from '../redux/reducers/cartReducer';
import { orderSliceActions } from '../redux/reducers/orderReducer';
import { productSliceActions } from '../redux/reducers/productReducer';

const SearchBox = ({ placeholder, searchValue, setSearchValue }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const adminProductPath = '/admin/product';
  const adminOrderPath ='/admin/order';
  const myOrderPath ='/my/order';
  const cartPath ='/cart';
  const inputRef = useRef(null);
  const navigationType = useNavigationType();
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const searchCategory = query.get("searchCategory") || "";


  useEffect(() => {
    if(navigationType === "POP") setSearchValue(searchKeyword)
  }, [navigationType, setSearchValue, searchKeyword]);

  useEffect(() => {
    if(inputRef.current)
    inputRef.current.focus();
  },[]);

  const onChangeHandler = (event) => {
    setSearchValue(event.target.value);
  }
  
  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      let currentPath = location.pathname;
      let searchKeyword = event.target.value;   
      if(currentPath === adminProductPath) {
        dispatch(productSliceActions.changePageOfAdminProduct(1));
      } else if(currentPath === adminOrderPath) {
        dispatch(orderSliceActions.changePageOfOrder(1));
      } else if(currentPath === myOrderPath) {
        dispatch(orderSliceActions.changePageOfOrder(1));
      } else if(currentPath === cartPath) {
        dispatch(cartSliceActions.changePageOfCart(1));
      }   
      searchCategory
      ? navigate(`${currentPath}?searchCategory=${searchCategory}&searchKeyword=${searchKeyword}`)
      : navigate(`${currentPath}?searchKeyword=${searchKeyword}`);
    }
  };

  return (
    <div className="search-box">
      <FontAwesomeIcon className="search-icon" icon={faSearch} />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onKeyPress={onCheckEnter}
        onChange={onChangeHandler}
        value={searchValue}
      />
    </div>
  );
};

export default SearchBox;
