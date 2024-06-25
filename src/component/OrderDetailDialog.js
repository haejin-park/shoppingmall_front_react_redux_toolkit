import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Dropdown, Form, Modal, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ADMIN_ORDER_STATUS, ADMIN_ORDER_STATUS_REASON, CUSTOMER_ORDER_STATUS, CUSTOMER_ORDER_STATUS_REASON } from "../constants/order.constants";
import { orderActions } from "../redux/actions/orderAction";


const OrderDetailDialog = ({ open, handleClose, mode }) => {
  const dispatch = useDispatch();
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || ''; 
  const {error, selectedOrder, currentPage} = useSelector((state) => state.order);
  const [orderStatusList, setOrderStatusList] = useState(selectedOrder.data.items.map((item) => item.status));
  const [orderStatusReasonList, setOrderStatusReasonList] = useState(selectedOrder.data.items.map((item) => item.statusReason));
  const [orderStatusReasonError, setOrderStatusReasonError] = useState(false);
  const [newOrderStatusList, setNewOrderStatusList] = useState(Array.from({ length: selectedOrder.data.items.length }, () => ""));
  const [checkedIndexList, setCheckedIndexList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [hiddenCheckbox, setHiddenCheckbox] = useState(false);
  const [hiddenStatusDropdwon, setHiddenStatusDropdown] = useState(false);
  const [visibleReasonDropdwon, setVisibleReasonDropdown] = useState(false);


  useEffect(() => {
    if(checkedIndexList.length > 0) {
      const sortedCheckedIndexList = checkedIndexList.sort();
      setCheckedIndexList(sortedCheckedIndexList);
    }
  }, [checkedIndexList]);

  useEffect(() => {
    let bool = false;
    if(mode === "customer") {
      bool = selectedOrder.data.items.every((item) => {
        return item.status !== "상품 준비 중" && item.status !== "배송 중" && item.status !== "배송 완료"
      });
    } else if(mode === 'admin') {
      bool = selectedOrder.data.items.every((item) => {
        return item.status === "배송 완료" || item.status === "환불 완료" || item.status === "환불 불가" || item.status === "교환 불가"
      });
    } 
    setHiddenStatusDropdown(bool);
    setHiddenCheckbox(bool);
  }, [mode, selectedOrder])

  useEffect(() => {
    if (checkedIndexList.length === 0 || newOrderStatusList.length === 0) {
      setVisibleReasonDropdown(false);
      return;
    } 
    const firstCheckedNewOrderStatus = newOrderStatusList[checkedIndexList[0]];

    const checkedStatusIsAllExistAndSame = checkedIndexList.every((index) => {
      return newOrderStatusList[index] && newOrderStatusList[index] === firstCheckedNewOrderStatus;
    });

    if(mode === 'customer') {
      setVisibleReasonDropdown(checkedStatusIsAllExistAndSame); 
    }

    if(mode === 'admin') {
      const checkedStatusRequiresDropdown = newOrderStatusList.some((status, index) => {
        return checkedIndexList.includes(index) && 
        (((selectedOrder.data.items[index].status === "상품 준비 중" || selectedOrder.data.items[index].status === "교환 요청") &&  status === "환불 요청") || 
          status === "환불 불가" || 
          status === "교환 불가"
        );
        }  
      );

      if (!checkedStatusRequiresDropdown && !checkedStatusIsAllExistAndSame) {
        setVisibleReasonDropdown(false);
      } else if (!checkedStatusRequiresDropdown && checkedStatusIsAllExistAndSame) {
          setVisibleReasonDropdown(false);
      } else if (checkedStatusRequiresDropdown && !checkedStatusIsAllExistAndSame) {
          setVisibleReasonDropdown(false);
      } else {
        setVisibleReasonDropdown(true);
      }
    }
  },[mode, checkedIndexList, newOrderStatusList, selectedOrder]); 

  useEffect(() => {
    checkedIndexList.length === selectedOrder.data.items.length? setCheckedAll(true) : setCheckedAll(false);
  },[checkedIndexList, selectedOrder, dispatch]); 

  const onCheckItem = (index) => {
    const isChecked = checkedIndexList.includes(index);
    if(isChecked) {
      const updatedCheckedIndexList = checkedIndexList.filter(checkedIndex => checkedIndex !== index);
      setCheckedIndexList(updatedCheckedIndexList)
    } else {  
      setCheckedIndexList([...checkedIndexList, index]);
    }
  }

  const onCheckAllItem = () =>  {
    if(checkedIndexList.length === selectedOrder.data.items.length) {
      setCheckedIndexList([]);
    } else {
      let updateCheckedIndexList = []; 
      selectedOrder.data.items.forEach((_v, index) => updateCheckedIndexList.push(index));
      setCheckedIndexList(updateCheckedIndexList);
    }
  };

  const selectOrderStatus = (value) => {
    if (checkedIndexList.length === 0) {
      return;
    }
    const newStatus = value;
    const updatedOrderStatusList = orderStatusList.map((status, index) => {
      if (checkedIndexList.includes(index)) {
        return newStatus;
      }
      return status;
    });
    const newSelectedOrderStatusList = newOrderStatusList.map((status, index) => {
      if (checkedIndexList.includes(index)) {
        return newStatus;
      }
      return status;
    });
    setOrderStatusList(updatedOrderStatusList);
    setNewOrderStatusList(newSelectedOrderStatusList);
  };

  const selectOrderStatusReason = (value) => {
    if (checkedIndexList.length === 0) {
      return;
    }

    const newReason = value;
    if(newReason !== "" && orderStatusReasonError){
      setOrderStatusReasonError(false);
    }
    const updatedOrderStatusReasonList = orderStatusReasonList.map((status, index) => {
      if (checkedIndexList.includes(index)) {
        return newReason;
      }
      return status;
    });
    setOrderStatusReasonList(updatedOrderStatusReasonList);
  };

  const updateOrder = () => {
    const orderItemIdList = selectedOrder.data.items.map((item) => item._id);
    orderStatusList.forEach(item => {
      if(item === '') return;
    })

    const hasEmptyReason = newOrderStatusList.some((status, index) => {
      return (
        orderStatusReasonList[index] === "" && 
        ((mode === "admin" && ((selectedOrder.data.items[index].status === "상품 준비 중" && status === "환불 요청")  || status === "환불 불가" ||  status === "교환 불가")) || 
        (mode === "customer" && status !== ""))
      ) 
    })
    if(hasEmptyReason) {
      setOrderStatusReasonError(true);
      return;
    }
    dispatch(orderActions.updateOrder({id:selectedOrder.data._id, orderItemIdList, orderStatusList, orderStatusReasonList, query:{searchKeyword, currentPage}, mode}));
    handleClose();
  };
  
  if (!selectedOrder) {
    return <div>선택된 주문데이터를 조회할 수 없습니다.</div>;
  }
  return (
    <Modal show={open} onHide={handleClose} className="order-detail-dialog">
      {error && (
        <div>
          <Alert variant="danger" className="error-message">
            {error}
          </Alert>
        </div>
      )} 
      <Modal.Header closeButton>
        <Modal.Title><strong>주문 상세</strong></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="order-detail-dialog-order-info-col">
            <p><strong>예약번호: </strong>{selectedOrder.data.info.orderNum}</p>
          </Col>
          <Col>
            <p><strong>주문날짜: </strong>{selectedOrder.data.info.itemCreatedAt.slice(0, 10)}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p><strong>이메일: </strong>{selectedOrder.data.userData.email}</p>        
          </Col>
          <Col>
            <p><strong>받는 사람: </strong>{selectedOrder.data.info.contact.lastName + selectedOrder.data.info.contact.firstName }</p>        
          </Col>
        </Row>
        <Row>
          <Col>
            <p><strong>연락처: </strong>{selectedOrder.data.info.contact.contact}</p>        
          </Col>
          <Col>
            <p><strong>주소: </strong>{selectedOrder.data.info.shipTo.address + " " + selectedOrder.data.info.shipTo.city}</p>        
          </Col>
        </Row>
        <p className="order-detail-dialog-items"><strong>주문 내역</strong></p>
        <div className="overflow-x">
          <Table>
            <thead className="table-header">
              <tr>
                {!hiddenCheckbox && 
                  <th>
                    <Form.Check 
                      disabled={     
                        selectedOrder.data.items.some((item, index) => (
                        (mode === "customer" && (item.status !== '상품 준비 중' && item.status !== '배송 중' && item.status !== '배송 완료'))
                        || (mode === "admin" && (item.status === '배송 완료' || item.status === '환불 완료' || item.status === '환불 불가' || item.status === '교환 불가'))
                      ))}
                      onChange={() => onCheckAllItem()} 
                      checked={checkedAll}
                    />
                  </th>
                }
                <th>ID</th>
                <th>상품명</th>
                <th>주문 상태</th>
                <th>사유</th>
                <th>개별 금액</th>
                <th>수량</th>
                <th>총 금액</th>
              </tr>
            </thead>
            <tbody >
              {selectedOrder.data.items.length > 0 &&
                selectedOrder.data.items.map((item, index) => (
                  <tr className="table-data" key={item._id}>
                    {!hiddenCheckbox && 
                      <td>
                        <Form.Check 
                          disabled={
                            (mode === "customer" && (item.status !== '상품 준비 중' && item.status !== '배송 중' && item.status !== '배송 완료'))
                            || (mode === "admin" && (item.status === '배송 완료' || item.status === '환불 완료' || item.status === '환불 불가' || item.status === '교환 불가'))
                          }
                          onChange={() => onCheckItem(index)}
                          checked={checkedIndexList.includes(index) || checkedAll} 
                        />
                      </td>
                    }
                    <td className="order-detail-dialog-order-item-id">{item._id}</td>
                    <td>{item.productData.name}</td>
                    <td>{orderStatusList[index]}</td>
                    <td>{orderStatusReasonList[index]}</td>
                    <td>{(item.price).toLocaleString()}</td>
                    <td>{item.qty}</td>
                    <td>{(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              <tr>
                <th colSpan={!hiddenCheckbox ? 7 : 6}>총계:</th>
                <td className="table-data">{(selectedOrder.data.info.totalPrice).toLocaleString()}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        {!hiddenStatusDropdwon && 
          <Dropdown
            className="order-status-drop-down"
            align="start"
            onSelect={(value) => selectOrderStatus(value)}
          >
            <Dropdown.Toggle
              className="order-status-drop-down-toggle"
              id="dropdown-basic"
              align="start"
            >
              주문 상태 선택
            </Dropdown.Toggle>
            <Dropdown.Menu className="order-status-drop-down-menu">
              {mode === "customer" 
                ? CUSTOMER_ORDER_STATUS.map((status, idx) => (
                  <Dropdown.Item 
                    disabled={selectedOrder.data.items.some((item, index) => {
                      return checkedIndexList.includes(index) && (
                      (status === "취소 요청" && item.status !== "상품 준비 중") || 
                      ((status === "교환 요청" || status === "반품 요청") && (item.status !== "배송 중" && item.status !== "배송 완료"))
                      )})}
                    key={idx} 
                    eventKey={status}
                  >
                    {status}
                  </Dropdown.Item>
                ))
                : ADMIN_ORDER_STATUS.map((status, idx) => (
                  <Dropdown.Item 
                    disabled={selectedOrder.data.items.some((item, index) => {
                      return checkedIndexList.includes(index) && (
                      (status === "배송 중" && (item.status !== "상품 준비 중" && item.status !== "교환 요청")) ||
                      (status === "배송 완료" && item.status !== "배송 중") ||
                      (status === "환불 요청" && (item.status !== "상품 준비 중" && item.status !== "취소 요청" && item.status !== "반품 요청")) ||
                      (status === "환불 완료" && item.status !== "환불 요청") || 
                      (status === "환불 불가" && item.status !== "반품 요청") || 
                      (status === "교환 불가" && item.status !== "교환 요청")
                      )})}
                    key={idx} 
                    eventKey={status}
                  >
                    {status}
                  </Dropdown.Item>
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
        }
        {visibleReasonDropdwon &&  
          <Dropdown
            className="order-status-drop-down"
            align="start"
            onSelect={(value) => selectOrderStatusReason(value)}
          >
          <Dropdown.Toggle
            className="order-status-drop-down-toggle"
            id="dropdown-basic"
            align="start"
          >
            주문 상태 사유 선택
          </Dropdown.Toggle>
          <Dropdown.Menu className="order-status-drop-down-menu">
            {mode === "customer" 
              ? CUSTOMER_ORDER_STATUS_REASON.map((reason, idx) => (
                <Dropdown.Item 
                  disabled={
                    ((reason === "판매자 귀책 사유:상품 파손" || reason === "판매자 귀책 사유:오배송") && newOrderStatusList.includes("취소 요청")) ||
                    ((reason === "판매자 귀책 사유:배송 지연") && (newOrderStatusList.includes("교환 요청") || newOrderStatusList.includes("반품 요청"))) 
                  }
                  key={idx} 
                  eventKey={reason}
                >
                  {reason}
                </Dropdown.Item>
              ))
              : ADMIN_ORDER_STATUS_REASON.map((reason, idx) => (
                <Dropdown.Item 
                  disabled={
                    ((reason === "소비자 귀책 : 상품 파손으로 인한 환불 불가" || reason ===  "수거 전 : 재고 부족으로 인한 교환 불가" || reason === "소비자 귀책 : 상품 파손으로 인한 교환 불가") && newOrderStatusList.includes("환불 요청")) || 
                    ((reason === "판매자 귀책 : 재고 부족으로 인한 환불" || reason ===  "수거 전 : 재고 부족으로 인한 교환 불가" || reason === "소비자 귀책 : 상품 파손으로 인한 교환 불가") && newOrderStatusList.includes("환불 불가")) || 
                    (reason === "소비자 귀책 : 상품 파손으로 인한 환불 불가" && newOrderStatusList.includes("교환 불가")) 
                  }
                  key={idx} 
                  eventKey={reason}                   
                 >
                  {reason}
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
          </Dropdown>
        }
        {orderStatusReasonError && (
          <span className="warning-message ml-2">주문 상태 사유를 선택해주세요</span>
        )}
      <div className="order-button-area">
        <Col>
          <Button onClick={handleClose} className="order-detail-dialog-close-btn">
            닫기
          </Button>
        </Col>
        <Col>
          <Button onClick={updateOrder} disabled={newOrderStatusList.every(item => item === "") || selectedOrder.data.items.every((item, index) => item.status === orderStatusList[index])}>저장</Button>
        </Col>
      </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
