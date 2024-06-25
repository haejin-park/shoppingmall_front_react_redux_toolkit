import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { cartActions } from "../redux/actions/cartAction";
import CartProductUpdateDialog from "./CartProductUpdateDialog";
import { cartSliceActions } from '../redux/reducers/cartReducer';

const CartProductCard = ({ item, checkedAll }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {checkedItemList, checkedItemTotalPrice, searchKeyword, currentPage } = useSelector((state) => state.cart);
  const [totalPrice, setTotalPrice] = useState(item.productData[0]?.price * item.items.qty);
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState("");

  useEffect(() => {
    setTotalPrice(item.productData[0]?.price * item.items.qty)
  },[item.productData, item.items.qty]);

  const deleteCartItem = (_id) => {
    dispatch(cartActions.deleteCartItem({_id, query: {searchKeyword, currentPage}}));
    const updatedCheckedItemList = checkedItemList.filter(checkedItem => checkedItem.items._id !== _id);
    const totalPrice = updatedCheckedItemList.reduce((total, item) => {
      return total + item.productData[0]?.price * item.items.qty;
    },0);
    dispatch(cartSliceActions.checkedCartItem({      
      checkedItemList:updatedCheckedItemList, 
      checkedItemTotalPrice:totalPrice
    }));
  };

  const onCheckItem = (item) => {
    const totalPrice = item.productData[0]?.price * item.items.qty;
    const isChecked = checkedItemList.includes(item);
    if(isChecked) {
      const updatedCheckedItemList = checkedItemList.filter(checkedItem => checkedItem !== item);
      dispatch(cartSliceActions.checkedCartItem({      
        checkedItemList:updatedCheckedItemList, 
        checkedItemTotalPrice: checkedItemTotalPrice - totalPrice
      }));
    } else {  
      dispatch(cartSliceActions.checkedCartItem({      
        checkedItemList:[...checkedItemList, item], 
        checkedItemTotalPrice:checkedItemTotalPrice + totalPrice
      }));   
    }
  }

  const openEditForm = (item) => {
    dispatch(cartSliceActions.setSelectedCartItem(item));
    setMode('edit');
    setShowDialog(true);
  };

  const goProductDetail = (id) => {
    navigate(`/product/${id}`)
  }

  return (
    <div className={`product-card-cart ${item.productData[0]?.isDeleted && 'deleted-product'} `}>
      <div className="cart-img-col">
        <Form.Check 
          className="item-checkbox" 
          onChange={() => onCheckItem(item)}
          checked={checkedItemList.includes(item) || checkedAll} 
        />
        <img
          onClick={() => goProductDetail(item.items.productId)}
          src={item.productData[0]?.image}
          alt={item.productData[0]?.name}
          width={112}
        />
      </div>
      <div className="cart-product-info-col">
        <div className="display-flex space-between">
          <h5>{item.productData[0]?.name}</h5>
          <button className="trash-button">
            <FontAwesomeIcon
              icon={faTrash}
              width={24}
              onClick={() => deleteCartItem(item.items._id)}
            />
          </button>
        </div>
        <div>
          <strong>₩ {item.productData[0]?.price}</strong>
        </div>
        <div>Size: {item.items.size}</div>
        <div>Quantity:{item.items.qty}</div>
        <div>Total: {totalPrice}</div>
        {!item.productData[0]?.isDeleted &&
          <Button variant="dark" className="mt-1" size="sm" onClick={() => openEditForm(item)}>
            옵션 변경
          </Button>
        }
      </div>
      <CartProductUpdateDialog
        mode={mode}
        setMode={setMode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        cartProductId={item.items.productId}
      />
    </div>
  );
};

export default CartProductCard;
