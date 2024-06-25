import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { badgeBg } from "../constants/order.constants";
import { dateFormat } from "../utils/date";
import { setOrderAndBadgeStatus } from "../utils/status";

const OrderStatusCard = ({order, openEditForm}) => {
  const dispatch = useDispatch();
  const [orderStatus, setOrderStatus] = useState();
  const [badgeStatus, setBadgeStatus] = useState();

  useEffect(() => {
    const {orderStatus, badgeStatus}  = setOrderAndBadgeStatus(order.data.items);
    setOrderStatus(orderStatus);
    setBadgeStatus(badgeStatus);
  }, [dispatch, order]);  

  return (
    <div className="status-card" onClick={() => openEditForm(order)}>
      <div className="order-img-and-col">
        <div className="order-img-col">
          <img
            src={order.data.items[0].productData.image}
            alt={order.data.items[0].productData.name}
            height={96}
          />
        </div>
        <div className="order-info-col">
          <div><strong>주문번호: {order.data.info.orderNum}</strong></div>
          <div>주문 일시: {dateFormat(order.data.info.itemCreatedAt)}</div>
          <div>상품명: {`${order.data.items[0].productData.name}외 ${order.data.items.length - 1}건`}</div>
          <div>총 주문 금액: ₩ {order.data.info.totalPrice}</div>
        </div>
      </div>
      <div className="order-status-col">
        <div className="order-status">주문상태</div>
        <Badge bg={badgeBg[badgeStatus]}>{orderStatus}</Badge>
      </div>
    </div>
  );
};

export default OrderStatusCard;
