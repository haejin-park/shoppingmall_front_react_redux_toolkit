export const dateFormat = (dateString) => {
var date = new Date(dateString);
var formattedDate = `${date.getFullYear()}년 ${("0" + (date.getMonth() + 1)).slice(-2)}월 ${("0" + date.getDate()).slice(-2)}일 ${("0" + date.getHours()).slice(-2)}시${("0" + date.getMinutes()).slice(-2)}분`;
return formattedDate;
}
