import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Dropdown, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { orderSliceActions } from '../redux/reducers/orderReducer';
import { cartActions } from "../redux/actions/cartAction";
import { commonUiSliceActions } from "../redux/reducers/commonUiReducer";
import { productActions } from "../redux/actions/productAction";
import "../style/productDetail.style.css";

const ProductDetail = ({handleClose, mode, cartProductId, setShowDialog, setMode}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [query] = useSearchParams(); 
  const searchKeyword = query.get("searchKeyword") || ''; 
  const { user } = useSelector((state) => state.user);
  const { product, loading, error } = useSelector((state) => state.product);
  const { selectedItem, currentPage } = useSelector((state) => state.cart);
  const [ cartItemInitialOption ] = useState([[selectedItem?.items?.size, selectedItem?.items?.qty]]);
  const [ selectedOption, setSelectedOption ] = useState(mode === "edit"? [[selectedItem?.items?.size, selectedItem?.items?.qty]] : []);
  const [ optionChangeStatus, setOptionChangeStatus ] = useState(false);
  const [ sizeError, setSizeError ] = useState(false);
  const [ qtyError, setQtyError ] = useState(false);
  const [ totalPrice, setTotalPrice ] = useState(0);
  const [ deletedProductError, setDeletedProductError ] = useState(false);

  useEffect(() => {
    if(id) {
      dispatch(productActions.getProductDetail(id));
    } else if(cartProductId) {
      dispatch(productActions.getProductDetail(cartProductId));
    }
  }, [id, cartProductId, dispatch]);

  useEffect(() => {
    product.isDeleted ? setDeletedProductError(true) : setDeletedProductError(false);
  },[product]);

  useEffect(() => {
    if(selectedOption.length === 0 && qtyError) setQtyError(false)
  },[selectedOption, qtyError]);


  useEffect(() => {
    if(selectedOption.length <= 0) {
      setOptionChangeStatus(false);
      return;
    } 
    if(cartItemInitialOption.length !== selectedOption.length) {
      for(let i = 0; i < cartItemInitialOption.length; i++) {
          if(selectedOption[i][1] >= 1) {
            setOptionChangeStatus(true);
            break;
          }
        }
    } else { 
      for(let i = 0; i < cartItemInitialOption.length; i++) {
        if(cartItemInitialOption[i][0] !== selectedOption[i][0] || cartItemInitialOption[i][1] !== selectedOption[i][1]) {
          if(selectedOption[i][1] >= 1) {
            setOptionChangeStatus(true);
            break;
          }
        } 
        setOptionChangeStatus(false);
      }
    }
  }, [cartItemInitialOption, selectedOption])
  
  useEffect(() => {
    if(selectedOption.length > 0) {
      const totalPrice = selectedOption.reduce((total, option) => {
        let sizePrice = product.price;
        if(option[1]) {
          sizePrice *=  parseInt(option[1]); 
        } else {
          sizePrice = 0
        } 
        return total + sizePrice
      },0)
      setTotalPrice(totalPrice)
    } 
  },[product.price, selectedOption]);

  const checkProductAndOptionAndUser = async() => {
    if(deletedProductError) {
      return Promise.reject();
    }

    if(selectedOption.length === 0) {
      setSizeError(true);
      return Promise.reject();
    }

    if(qtyError) {
      return Promise.reject();
    }

    if(!user) {
      dispatch(commonUiSliceActions.showToastMessage({message:"로그인 후 이용 가능합니다.", status:"error"}));
      navigate('/login');
      return Promise.reject();

    }
  }

  const initialState = () => {
    setDeletedProductError(false);
    setSelectedOption([]);
    setTotalPrice(0);
  }

  const addCartItem = async() => {
    try {
      await checkProductAndOptionAndUser()
      let selectedOptionObj =  Object.fromEntries(selectedOption);
      if(id) dispatch(cartActions.addToCart({productId:id, selectedOptionObj}));
      initialState();
    } catch(error) {}
  };

  const updateCartItem = async() => {
    try {
      await checkProductAndOptionAndUser()
      let cartItemInitialOptionObj = Object.fromEntries(cartItemInitialOption);
      let selectedOptionObj = Object.fromEntries(selectedOption);
      if(cartProductId) {
        dispatch(cartActions.updateCartItemQty(
          {productId: cartProductId, cartItemInitialOptionObj, selectedOptionObj, query: {searchKeyword, currentPage}}
        ));
        setShowDialog(false);
        setMode("");
      }
      initialState();
    } catch(error) {}
  };

  const goOrder = async() => {
    try {
      await checkProductAndOptionAndUser()
      let selectedOptionObj =  Object.fromEntries(selectedOption);
      let orderItemList = [];
      let productData = [product];
      for(const size of Object.keys(selectedOptionObj)){ 
        orderItemList = [{items:{productId:id, size, qty:selectedOptionObj[size]},productData}];
      }
      dispatch(orderSliceActions.saveOrderItem({orderItemList, totalPrice, cartOrderStatus:false}));
      setDeletedProductError(false);
      setSelectedOption([]);
      setTotalPrice(0);
      navigate("/order");
    } catch(error) {}
  }

  const handleSelectSize = (value) => {
    if(selectedOption?.length > 0){
      let newOption = [...selectedOption, [value,1]];
      setSelectedOption(newOption); 
    } else {
      setSelectedOption([[value,1]]);
    }
    setSizeError(false);     
  };

  const handleIncrement = (index) => {
    const newSelectedOption = [...selectedOption];
      if(newSelectedOption[index][1] >= 1) {
        newSelectedOption[index][1] += 1; 
      } else {
        newSelectedOption[index][1] = 1; 
      }
      setQtyError(false); 
      setSelectedOption([...newSelectedOption]);
  };

  const handleDecrement = (index) => {
    const newSelectedOption = [...selectedOption];
    if (newSelectedOption[index][1] >= 1) {
      newSelectedOption[index][1] -= 1; 
    } 
    newSelectedOption[index][1] <= 0 && setQtyError(true);  
    setSelectedOption([...newSelectedOption]);
  }

  const handleSelectQty = (value, index) => {
    const newSelectedOption = [...selectedOption];
    newSelectedOption[index][1] = parseInt(value)
    value <= 0 || newSelectedOption[index][1] <= 0 ? setQtyError(true) : setQtyError(false); 
    setSelectedOption([...newSelectedOption]);
  };

  const deleteSelectedOption = (index) => {
    const newSelectedOption = selectedOption.filter((option, idx) => index !== idx);
    setSelectedOption(newSelectedOption);
    const totalPrice = newSelectedOption.reduce((total, option) => {
      let sizePrice =  product.price; 
      if(option[1]) {
        sizePrice *= parseInt(option[1]);  
      } else {
        sizePrice = 0;
      }
      return total + sizePrice
    },0);
    setTotalPrice(totalPrice);
  }

  return (
    <Container className="product-detail-card">
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
        <Col md={6}>
          <img src={product.image} className="w-100" alt={product.name} />
        </Col>
        <Col className="product-info-area" md={6}>
          <div className="product-info">{product.name}</div>
          <div className="product-info">₩ {product.price}</div>
          <div className="product-info">{product.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            align="start"
            onSelect={(value) => handleSelectSize(value)}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              align="start"
            >
            사이즈 선택
            </Dropdown.Toggle>
            <Dropdown.Menu className="size-drop-down">
              {product.stock && Object.keys(product?.stock).map((size, index) => (
                <Dropdown.Item 
                  key={index} 
                  eventKey={size}
                  disabled={selectedOption.some(
                    (option) => option[0].toUpperCase() === size.toUpperCase()
                  )}
                >
                  {`${size} (재고 수량 ${product?.stock[size]})`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>          
          {selectedOption?.map((item, index) => (
            <div className="selected-option-div" key={index}>
              <Row className="selected-option-row">
                <Col sm={2} xs={2}>
                  {item[0]}
                </Col>
                <Col sm={8} xs={8}>
                  <InputGroup>
                    <Button variant="outline-secondary" onClick={() => handleDecrement(index)}>-</Button>
                      <Form.Control
                        type="number"
                        value={item[1] || ''}
                        onChange={(event) => handleSelectQty(event.target.value, index)}
                      />
                    <Button variant="outline-secondary" onClick={() => handleIncrement(index)}>+</Button>
                  </InputGroup>
                </Col>
                <Col sm={2} xs={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteSelectedOption(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <div className="warning-message">
            {sizeError && "사이즈를 선택해주세요."}
          </div>
          <div className="warning-message">
            {qtyError && "수량 1개 이상 선택가능합니다."}
          </div>
          <strong>Total: {totalPrice}</strong>
          {mode === "edit" ? (
          <Row className="cart-btn-row">
            <Col>
              <Button className="cart-cancel-btn" variant="secondary" onClick={handleClose}>
                취소
              </Button>
            </Col>
            <Col>
              <Button className="cart-complete-btn" variant="dark" onClick={updateCartItem} disabled={!optionChangeStatus && !deletedProductError}>
                수정 완료
              </Button>
            </Col>
          </Row>
          ) : (
          <Row className="product-detail-btn-row">
            <Col>
              <Button className="add-button" variant="dark" onClick={addCartItem} disabled={!user || user?.level === "admin" || selectedOption.some((item) => !item[1])}>
                장바구니
              </Button>     
            </Col>
            <Col>
              <Button className="order-button" variant="dark" onClick={goOrder} disabled={!user || user?.level === "admin" || selectedOption.some((item) => !item[1])}>
                주문하기
              </Button>
            </Col>
          </Row>
          )}
          {deletedProductError && (
          <div className="deleted-product-error-message">
            <Alert variant="danger" className="error-message">
              상품이 삭제 되었습니다. 삭제된 상품은 장바구니 추가 또는 주문 할 수 없습니다.
            </Alert>
          </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
