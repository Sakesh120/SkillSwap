import axios from "axios";

const API = axios.create({
  baseURL: "https://skillswap-backend-ipgk.onrender.com/api", // your backend URL
  withCredentials: true, // important if using cookies
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
