export const toTransformEnglishCategory = (category) => {
    switch (category) {
        case "남성":
            return "man";
        case "여성":
            return "woman";
        case "상의":
            return "top";
        case "하의":
            return "bottom";
        case "재킷":
            return "jacket";
        case "후드티":
            return "hoodie";
        case "스웨트셔츠":
            return "sweat-shirts";
        case "티셔츠":
            return "t-shirts";
        case "셔츠":
            return "shirts";
        case "블라우스":
            return "blouse";
        case "팬츠":
            return "pants";
        case "스커트":
            return "skirt";
        case "원피스":
            return "dress";
        default:
            return "";
    }
}
