import {
  faBars,
  faBox,
  faRightFromBracket,
  faRightToBracket,
  faSearch,
  faShoppingBag,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useNavigationType, useSearchParams } from "react-router-dom";
import * as productTypes from '../constants/product.constants';
import { cartActions } from "../redux/actions/cartAction";
import { userActions } from "../redux/actions/userAction";
import { toTransformEnglishCategory } from "../utils/category";
import { transformEnglishSortBy } from "../utils/sortBy";
import { userSliceActions } from '../redux/reducers/userReducer';
import { cartSliceActions } from '../redux/reducers/cartReducer';
import { orderSliceActions } from '../redux/reducers/orderReducer';
import { productSliceActions } from '../redux/reducers/productReducer';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const searchCategory = query.get("searchCategory") || "";
  const inputRef = useRef(null);
  const { user, error:userError } = useSelector((state) => state.user);
  const { mainSortBy:sortBy } = useSelector((state) => state.product);
  const { cartItemCount } = useSelector((state) => state.cart);
  const [loginStatus, setLoginStatus] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sideCategoryMenuWidth, setSideCategoryMenuWidth] = useState(0);
  const [sideSearchWidth, setSideSearchWidth] = useState(0);
  const [overlayStatus, setOverlayStatus] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const adminProductPath = '/admin/product';
  const myOrderPath ='/my/order';
  const cartPath = '/cart';
  const mainProductPath = '/';

  useEffect(() => {
    if(!user && (currentPath === '/login' || currentPath === '/register')) {
      setLoginStatus(false);
    } else {
      setLoginStatus(true);
    }
  }, [user, currentPath]);

  useEffect(() => {
    if(user && user.level === "customer") {
      dispatch(cartActions.getCartItemCount())
    }
  },[user,dispatch]);


  useEffect(() => {
    if(navigationType === "POP") {
      setSearchValue(searchKeyword)
      dispatch(productSliceActions.selectSortByMainProductList(sortBy));
    }
  }, [navigationType, setSearchValue, searchKeyword, sortBy, dispatch]);

  useEffect(() => {
    if(inputRef.current)
    inputRef.current.focus();
  }, [sideSearchWidth]);

  const onChangeHandler = (event) => {
    setSearchValue(event.target.value);
  }

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      let searchKeyword = event.target.value;   
      dispatch(productSliceActions.changePageOfMainProduct(1));
      dispatch(productSliceActions.changePageOfMainProduct(1));
      searchCategory
      ? navigate(`${mainProductPath}?searchCategory=${searchCategory}&searchKeyword=${searchKeyword}`)
      : navigate(`${mainProductPath}?searchKeyword=${searchKeyword}`);
      if(sideCategoryMenuWidth > 0) {
        handleCloseSideCategoryMenu();
      } else if(sideSearchWidth > 0) {
        handleCloseSideSearchMenu();

      }
    }
  };

  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;

  useEffect(() => {
    const handleEscapeKeyPress = (event) => {
      if (event.key === 'Escape') {
        handleCloseSideSearchMenu();
        handleCloseSideCategoryMenu();
      }
    };
    document.addEventListener('keydown', handleEscapeKeyPress);
  
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, []); 

  const handleOpenSideCategoryMenu= (width) => {
    setSideCategoryMenuWidth(width);
    setOverlayStatus(true)
  }

  const handleCloseSideCategoryMenu = () => {
    setSideCategoryMenuWidth(0);
    setOverlayStatus(false)
  }
  const handleOpenSideSearchMenu = (width) => {
    setSideSearchWidth(width);
    setOverlayStatus(true)
  }

  const handleCloseSideSearchMenu = () => {
    setSideSearchWidth(0);
    setOverlayStatus(false)
  }

  const goAdminProduct = () => {
    setSearchValue('');
    setSelectedCategory('');
    const prevAdminSortBy = sessionStorage.getItem("prevAdminSortBy");
    if(prevAdminSortBy) sessionStorage.removeItem("prevAdminSortBy");
    dispatch(productSliceActions.selectSortByAdminProductList("latest"));
    dispatch(productSliceActions.changePageOfAdminProduct(1));
    navigate(adminProductPath);
  }

  const goLogout = () => {
    dispatch(userActions.logout(user.email));
  }

  const goLogin = () => {
    setSearchValue('');
    setSelectedCategory('');
    navigate("/login")
  }
  const goCart = () => {
    setSearchValue('');
    setSelectedCategory('');
    dispatch(cartSliceActions.checkedCartItem({checkedItemList:[], checkedItemTotalPrice:0}));
    dispatch(orderSliceActions.saveOrderItem({orderItemList:[], totalPrice:0, cartOrderStatus:true}));
    dispatch(cartSliceActions.changePageOfCart(1));
    navigate(cartPath);
  }

  const goMyOrder = () => {
    setSearchValue('')
    setSelectedCategory('');
    dispatch(cartSliceActions.checkedCartItem({checkedItemList:[], checkedItemTotalPrice:0}));
    dispatch(orderSliceActions.saveOrderItem({orderItemList:[], totalPrice:0, cartOrderStatus:false}));
    dispatch(orderSliceActions.changePageOfOrder(1));
    navigate(myOrderPath);
  }

  const goMainProduct = () => {
    setSearchValue('')
    setSelectedCategory('');
    const prevMainSortBy = sessionStorage.getItem("prevMainSortBy");
    if(prevMainSortBy) sessionStorage.removeItem("prevMainSortBy");
    dispatch(productSliceActions.selectSortByMainProductList("popularity"));
    if(userError) dispatch(userSliceActions.deleteUserError());
    dispatch(cartSliceActions.checkedCartItem({checkedItemList:[], checkedItemTotalPrice:0}));
    dispatch(orderSliceActions.saveOrderItem({orderItemList:[], totalPrice:0, cartOrderStatus:false}));
    dispatch(productSliceActions.changePageOfMainProduct(1));
    navigate(mainProductPath);
  }

  const goCategory = (category)=> {
    dispatch(cartSliceActions.checkedCartItem({checkedItemList:[], checkedItemTotalPrice:0}));
    dispatch(orderSliceActions.saveOrderItem({orderItemList:[], totalPrice:0, cartOrderStatus:false}));
    const searchCategory = toTransformEnglishCategory(category);
    dispatch(productSliceActions.changePageOfMainProduct(1));
    searchKeyword
    ? navigate(`${mainProductPath}?searchCategory=${searchCategory}&searchKeyword=${searchKeyword}`)
    : navigate(`${mainProductPath}?searchCategory=${searchCategory}`);
    setSelectedCategory(category);
  }

  const selectSortBy = (value) => {
    const sortBy = transformEnglishSortBy(value)
    sessionStorage.setItem("prevMainSortBy", sortBy);
    dispatch(productSliceActions.selectSortByMainProductList(sortBy));
  }

  return (
    <div>
      {loginStatus && ( 
        <div>
          <div className="side-category-menu" style={{ width: sideCategoryMenuWidth }}>
            <button className="closebtn" onClick={() => handleCloseSideCategoryMenu()}>
              &times;
            </button>
            <div className={location.pathname === mainProductPath ? "side-category-menu-list" : 'no-main-side-category-menu-list'} id="menu-list">
              {productTypes.categoryMenuList.map((category, index) => (
                <div key={index}>
                  <button 
                  className ={`side-category-menu-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => goCategory(category)}>
                    {category}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="side-search-menu" style={{ width: sideSearchWidth }}>
            <button className="closebtn" onClick={() => handleCloseSideSearchMenu()}>
              &times;
            </button>
            <div className="mt-2 main-side-search-box">
              <div className="search-box">
                <FontAwesomeIcon className="search-icon" icon={faSearch} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="상품명 검색"
                  onKeyPress={onCheckEnter}
                  onChange={onChangeHandler}
                  value={searchValue}
                />
              </div>
            </div>
          </div>
          <div className={`overlay ${overlayStatus ? 'overlay-show' : ''}`}></div>
          <div className="nav-header">
            <div className={location.pathname === mainProductPath? "main-burger-menu" : "no-main-burger-menu"}>
              <FontAwesomeIcon icon={faBars} onClick={() => handleOpenSideCategoryMenu(250)} />
            </div>
            <div>
              <div className="display-flex">
                <div onClick={() => handleOpenSideSearchMenu(250)} className={`nav-function ${location.pathname === mainProductPath?'main-search-icon':''}`}>
                  <FontAwesomeIcon icon={faSearch} />
                  {!isMobile && (
                      <span style={{ cursor: "pointer" }}>상품 검색</span>
                  )}
                </div>
                {user && user.level === "admin" && (
                  <div onClick={() => goAdminProduct()} className="nav-function">
                    <FontAwesomeIcon icon={faUser} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>관리자</span>
                    )}
                  </div>
                )}
                {user ? 
                  <div onClick={() => goLogout()} className="nav-function">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>로그아웃</span>
                    )}
                  </div>
                  : 
                  <div onClick={() => goLogin()} className="nav-function">
                    <FontAwesomeIcon icon={faRightToBracket} />
                    {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
                  </div>
                }        
                {user?.level === "customer" &&
                <div className="customer-navbar-menu">
                  <div onClick={() => goCart()} className="nav-function">
                    <FontAwesomeIcon icon={faShoppingBag} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>{`장바구니(${
                        cartItemCount
                      })`}</span>
                    )}
                  </div>
                  <div
                    onClick={() => goMyOrder()}
                    className="nav-function"
                  >
                    <FontAwesomeIcon icon={faBox} />
                    {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
                  </div>
                </div>          
                }     
              </div>
            </div>
          </div>
        </div>  
      )}
      <div className={`nav-logo ${loginStatus? '' : 'login-false'}`}>
        <div onClick={() => goMainProduct()}>
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </div>
      </div>
      {location.pathname === mainProductPath && (
        <Container className="nav-menu-area">
          <Dropdown
              className="main-sort-by-dropdown sort-by"
              align="start"
              onSelect={(value) => selectSortBy(value)}
            >
            <Dropdown.Toggle variant="" id="dropdown-basic" align="start">
              상품 정렬
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {productTypes.SORT_BY.map((sort, index) => (
              <Dropdown.Item key={index} eventKey={sort}>{sort}</Dropdown.Item>
            ))}
            </Dropdown.Menu> 
          </Dropdown>

          <ul className="menu">
            {productTypes.categoryMenuList.map((category, index) => (
              <li key={index}>
                <button 
                  className={`category-menu-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => goCategory(category)}>{category}</button>
              </li>
            ))}
          </ul>
          <div className="main-search-box">
            <div className="search-box">
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                ref={inputRef}
                type="text"
                placeholder="상품명 검색"
                onKeyPress={onCheckEnter}
                onChange={onChangeHandler}
                value={searchValue}
              />
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Navbar;
