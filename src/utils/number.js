export const currencyFormat = (value) => {
  const number = value !== undefined ? value : 0;
  return number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

export const ccExpiresFormat = (string) => {
  return string
    .replace(
      /[^0-9]/g,
      ""  
    )
    .replace(
      /^([2-9])$/g,
      "0$1" 
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      "0$1/$2"  
    )
    .replace(
      /^0{1,}/g,
      "0"  
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      "$1/$2" 
    );
};
