import React, { useEffect, useState } from "react";
import { Badge, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { badgeBg } from "../constants/order.constants";
import { setOrderAndBadgeStatus } from "../utils/status";

const OrderTable = ({ index, order, header, openEditForm }) => {
  const dispatch = useDispatch();  
  const [orderStatus, setOrderStatus] = useState();
  const [badgeStatus, setBadgeStatus] = useState();

  useEffect(() => {
    const {orderStatus, badgeStatus}  = setOrderAndBadgeStatus(order.data.items);
    setOrderStatus(orderStatus);
    setBadgeStatus(badgeStatus);
  }, [dispatch, order]);   
  
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead className="table-header">
          <tr>
            {header.map((title) => (
              <th key={title}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody className="table-data">
          <tr key={order.data._id} onClick={() => openEditForm(order)}>
            <td>{index}</td>
            <td>{order.data.info.orderNum}</td>
            <td>{order.data.info.itemCreatedAt.slice(0, 10)}</td>
            <td>{order.data.userData.email}</td>
            <td>
              {order.data.items.length > 1 
              ? `${order.data.items[0].productData.name}외 ${order.data.items.length - 1}개`
              :`${order.data.items[0].productData.name}`
              }
            </td>
            <td>{order.data.info.shipTo.address + " " + order.data.info.shipTo.city}</td>
            <td>{(order.data.info.totalPrice).toLocaleString()}</td>
            <td>
              <Badge bg={badgeBg[badgeStatus]}>{orderStatus}</Badge>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
export default OrderTable;
