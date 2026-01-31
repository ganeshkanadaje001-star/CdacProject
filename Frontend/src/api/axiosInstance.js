import axios from "axios";
import { decodeJwt } from "../utils/jwt";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url.includes("/User/signin")) {
    const decoded = decodeJwt(token);
    const exp = decoded?.exp;
    // If token expired, clear and notify
    if (exp && exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: { type: "error", message: "Session expired. Please login again." },
        })
      );
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    const data = error.response?.data;
    console.error("API Error:", { status, method, url, data });
    const message =
      data?.message ||
      (status === 401
        ? "Unauthorized. Please login."
        : "Something went wrong. Try again.");
    // show toast banner
    window.dispatchEvent(
      new CustomEvent("app:toast", {
        detail: { type: "error", message },
      })
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
