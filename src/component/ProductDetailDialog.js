import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { CATEGORY, SIZE, STATUS } from "../constants/product.constants";
import { productActions } from "../redux/actions/productAction";
import { productSliceActions } from '../redux/reducers/productReducer';
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: "",
};

const ProductDetailDialog = ({ mode, showDialog, setShowDialog, sortBy }) => {
  const { error, selectedProduct, adminCurrentPage:currentPage } = useSelector((state) => state.product);
  const [formData, setFormData] = useState(mode === "new" ? { ...InitialFormData } : {...selectedProduct });
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";


  useEffect(() => {
    if(mode === "new"){
      setFormData({ ...InitialFormData })
      setStock([]); 
    } else {
      setFormData({...selectedProduct }) 
      const stockArrary = Object.entries(selectedProduct.stock);
      setStock(stockArrary);
    }
  }, [mode, selectedProduct, showDialog]);

  const handleClose = () => {
    setShowDialog(false);
    mode === "new" ? setFormData({ ...InitialFormData }) : setFormData({...selectedProduct})
    setStock([]);
    dispatch(productSliceActions.deleteProductError());
    setStockError(false);
    setImageError(false);
    setPriceError(false);
  };

  const handleChange = (event) => {
    const {id, value} = event.target;
    if (id === 'price') {
      value <= 0 || value === ''? setPriceError(true):setPriceError(false);
    } 
    setFormData({...formData, [id]: value});
  };

  const addStock = (sizeLength) => { 
    if(stock.length < sizeLength) {
      setStock([...stock, []]);
      setStockError(false)
    }
  };

  const deleteStock = (index) => { 
    const newStock = stock.filter((item, idx) => idx !== index);
    setStock(newStock);
  };

  const handleStockSizeChange = (value, index) => {
    const newStock = stock.map((item, idx) => {
      if (idx === index) return [value, item[1]]; 
      return item;
    });
    setStock(newStock);
  }
  const handleStockQtyChange = (value, index) => {
    const newStock = stock.map((item, idx) => {
      if (idx === index && value >= 0) return [item[0], value];  
      return item;
    });
    setStock(newStock);
  };
  
  const onHandleCategory = (event) => {
    if (formData.category.includes(event.target.value)) {
      const newCategory = formData.category.filter((item) => item !== event.target.value); 
      setFormData({...formData, category: [...newCategory]});
    } else {
      setFormData({...formData, category: [...formData.category, event.target.value]});
    }
  };  

  const uploadImage = (url) => {
    setFormData({...formData, image:url});
    setImageError(false)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(stock?.length === 0) {
      setStockError(true);
      return;
    }
    if(!formData.image) {
      setImageError(true);
      return;
    }

    if(priceError) {
      return;
    }

    let stockObj = stock.reduce((total, item) => {
      return {...total, [item[0]]: parseInt(item[1])};
    },{});

    if (mode === "new") {
      dispatch(productActions.createProduct({formData:{...formData, stock:stockObj}, query:{searchKeyword: "", currentPage:1, sortBy},handleClose}));
    } else {
      dispatch(productActions.updateProduct({formData:{...formData, stock:stockObj}, query:{searchKeyword, currentPage, sortBy},handleClose}));
    }
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      {error && (
        <div>
          <Alert variant="danger" className="error-message">
            {error}
          </Alert>
        </div>
      )}
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>Create New Product</Modal.Title>
        ) : (
          <Modal.Title>Edit Product</Modal.Title>
        )}
      </Modal.Header>

      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Sku"
              required
              value={formData.sku}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Name"
              required
              value={formData.name}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="string"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-2">Stock</Form.Label>
          {stockError && (
            <span className="warning-message pr-1 mr-1">재고를 추가해주세요</span>
          )}
          <Button size="sm" onClick={() => addStock(SIZE.length)}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={`${item[0]}_${index}`}>
                <Col sm={5}>
                  <Form.Select
                    onChange={(event) =>
                      handleStockSizeChange(event.target.value, index)
                    }
                    required
                    defaultValue={item[0] ? item[0].toUpperCase() : ""}
                  >
                    <option value="" disabled hidden>
                      please choose size of stock
                    </option>
                    {SIZE.map((size, index) => (
                      <option
                        value={size.toUpperCase()}
                        disabled={stock.some((stockItem) => stockItem[0] === size.toUpperCase())}
                        key={index}
                      >
                        {size}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) =>
                      handleStockQtyChange(event.target.value, index)
                    }
                    type="number"
                    placeholder="please set quantity of stock"
                    value={item[1] || ''}
                    required
                  />
                </Col>
                <Col sm={1}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>
          
        <Form.Group className="mb-3" controlId="image" required>
          <Form.Label className="mr-1">Image</Form.Label>
          {imageError && (
            <span className="warning-message">이미지를 업로드 해주세요</span>
          )}
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          <Image
            id="uploadedimage"
            src={formData.image}
            className="upload-image mt-2 ml-2"
            alt="uploadedimage"
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={formData.price || ''}
              required
              onChange={handleChange}
              type="number"
              placeholder="price"
            />
            {priceError && <span className="warning-message">금액은 1원 이상 입력해주세요</span>}
          </Form.Group>
          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              multiple
              onChange={onHandleCategory}
              value={formData.category}
              required
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        {mode === "new" ? (
          <Button variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default ProductDetailDialog;
