import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({item}) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <div className="card" onClick={() => showProduct(item?._id)}>
      <img src={item?.image} alt={item?.name} />
      <div className="product-name">{item?.name}</div>
      <div>₩ {item?.price}</div>
    </div>
  );
};

export default ProductCard;
