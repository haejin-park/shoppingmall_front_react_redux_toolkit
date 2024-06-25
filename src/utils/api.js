import axios from "axios";

const token = sessionStorage.getItem("token");

let backURL = process.env.NODE_ENV === 'production' 
?  `${process.env.REACT_APP_BACK_PROXY}/api`
: `${process.env.REACT_APP_BACK_DEV_URL}/api`

const api = axios.create({
  baseURL: backURL,
  headers: {
    "Content-Type": "application/json",
    "authorization": token? `Bearer ${token}` : undefined
  },
});

api.interceptors.request.use(
  (request) => {
    return request;
  },
  function (error) {
    console.error(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    error = error.response.data;
    console.error(error);
    return Promise.reject(error);
  }
);

export default api;
