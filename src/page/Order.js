import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import OrderReceipt from "../component/OrderReceipt";
import PaymentForm from "../component/PaymentForm";
import { orderActions } from "../redux/actions/orderAction";
import "../style/order.style.css";
import { ccExpiresFormat } from "../utils/number";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, orderItemList, totalPrice, cartOrderStatus } = useSelector((state) => state.order);
  const [shipInfo, setShipInfo] = useState({
    lastName: "",
    firstName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });
  const [cardValue, setCardValue] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  useEffect(() => {
    if(orderItemList.length === 0) navigate(-1);
  },[orderItemList, navigate]);
  
  const handleFormChange = (event) => {
    const {name, value} = event.target;
    setShipInfo({...shipInfo, [name]:value});

  };

  const handlePaymentInfoChange = (event) => {
    const {name, value} = event.target;
    if(name === "expiry"){
      let newValue = ccExpiresFormat(value)
      setCardValue((prev) => ({...prev, [name]:newValue}));
      return; 
    }
    setCardValue((prev) => ({...prev, [name]:value}));
  };

  const handleInputFocus = (e) => {
    setCardValue((prev) => ({ ...prev, focus: e.target.name }));
  }; 
  
   const handleSubmit = (event) => {
    event.preventDefault();
    const {lastName,firstName,contact,address,city,zip} = shipInfo;
    const info = {
      totalPrice, 
      shipTo:{address,city,zip}, 
      contact:{lastName,firstName,contact}
    };
    const items = orderItemList.map(item => {
      return {
        productId: item.items.productId,
        price: item.productData[0].price,
        size: item.items.size,
        qty: item.items.qty
      };          
    })
    const orderList = [{info,items}];
    dispatch(orderActions.createOrder({orderList, cartOrderStatus, navigate}));
  };

  return (
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
        <Col>
          <div>
            <div className="mobile-receipt-area">
              <OrderReceipt />
            </div>  
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    placeholder="Apartment, studio, or floor"
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="zip"
                    />
                  </Form.Group>
                </Row>
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                  <PaymentForm 
                    handleInputFocus={handleInputFocus}
                    cardValue={cardValue}
                    handlePaymentInfoChange={handlePaymentInfoChange}
                  />
                </div>
                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                >
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col className="receipt-area">
          <OrderReceipt />
        </Col>
      </Row>
    </Container>
  );
};

export default Order;
