export const ADMIN_ORDER_STATUS = ["배송 중", "배송 완료", "환불 요청", "환불 완료", "환불 불가", "교환 불가"];
export const CUSTOMER_ORDER_STATUS = ["취소 요청", "교환 요청", "반품 요청"];
export const ADMIN_ORDER_STATUS_REASON = ["판매자 귀책 : 재고 부족으로 인한 환불", "소비자 귀책 : 상품 파손으로 인한 환불 불가", "수거 전 : 재고 부족으로 인한 교환 불가", "소비자 귀책 : 상품 파손으로 인한 교환 불가"]
export const CUSTOMER_ORDER_STATUS_REASON = ["소비자 귀책 사유:단순 변심", "소비자 귀책 사유:주문 실수", "판매자 귀책 사유:상품 파손", "판매자 귀책 사유:오배송", "판매자 귀책 사유:배송 지연"];
export const orderTableHeader = ["#", "주문 번호", "주문 날짜", "사용자 이메일", "주문 상품명", "주소", "총 금액", "상태"];

export const badgeBg = {
  preparing: "primary",
  cancelRequest: "secondary",
  shipping: "info",
  delivered: "success",
  exchangeRequest: "warning",
  returnRequest: "dark",
  refundRequest : "danger",
  refundComplete : "danger"
};
