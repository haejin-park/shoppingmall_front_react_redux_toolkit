export const setOrderAndBadgeStatus = (items) => {
  let orderStatus = '';
  let badgeStatus = '';
  if(items.every((item) => item.status === '환불 완료')){
    orderStatus = '전체 환불 완료';
    badgeStatus = 'refundComplete';
  } else if(items.some((item) => item.status === '환불 완료')){
    orderStatus = '부분 환불 완료';
    badgeStatus = 'refundComplete';
  }  if(items.every((item) => item.status === '환불 요청')){
    orderStatus = '전체 환불 요청';
    badgeStatus = 'refundRequest';
  } else if(items.some((item) => item.status === '환불 요청')){
    orderStatus = '부분 환불 요청';
    badgeStatus = 'refundRequest';
  } else if(items.every((item) => item.status === '반품 요청')){
    orderStatus = '전체 반품 요청';
    badgeStatus = 'returnRequest';
  } else if(items.some((item) => item.status === '반품 요청')){
    orderStatus = '부분 반품 요청';
    badgeStatus = 'returnRequest';
  } else if(items.every((item) => item.status === '교환 요청')){
    orderStatus = '전체 교환 요청';
    badgeStatus = 'exchangeRequest';
  } else if(items.some((item) => item.status === '교환 요청')){
    orderStatus = '부분 교환 요청';
    badgeStatus = 'exchangeRequest';
  } else if(items.every((item) => item.status === '취소 요청')){
    orderStatus = '전체 취소 요청';
    badgeStatus = 'cancelRequest';
  } else if(items.some((item) => item.status === '취소 요청')){
    orderStatus = '부분 취소 요청';
    badgeStatus = 'cancelRequest';
  } else if(items.every((item) => item.status === '배송 완료')){
    orderStatus = '전체 배송 완료';
    badgeStatus = 'delivered';
  } else if(items.some((item) => item.status === '배송 완료')){
    orderStatus = '부분 배송 완료';
    badgeStatus = 'delivered';
  } else if(items.every((item) => item.status === '배송 중')){
    orderStatus = '전체 배송 중';
    badgeStatus = 'shipping';
  } else if(items.some((item) => item.status === '배송 중')){
    orderStatus = '부분 배송 중';
    badgeStatus = 'shipping';
  } else if(items.every((item) => item.status === '상품 준비 중')){
    orderStatus = '상품 준비 중';
    badgeStatus = 'preparing';
  }
  return {orderStatus, badgeStatus};
}

