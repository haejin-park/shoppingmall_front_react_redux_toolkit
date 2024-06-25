import React from "react";
import { Alert, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import ProductDetail from "../page/ProductDetail";

const CartProductUpdateDialog = ({ mode, setMode, showDialog, setShowDialog, cartProductId }) => {
  const { loading, error } = useSelector((state) => state.cart);

  const handleClose = () => {
    setShowDialog(false);
    setMode("");
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
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
      <Modal.Header closeButton>
        <Modal.Title>장바구니 상품 옵션 수정</Modal.Title>
      </Modal.Header>
      <ProductDetail handleClose={handleClose} mode={mode} cartProductId={cartProductId} setShowDialog={setShowDialog} setMode={setMode}/>
    </Modal>
  );
};

export default CartProductUpdateDialog;
