import axiosInstance from "./axiosInstance";
import { API } from "./endpoints";

export const login = async (credentials) => {
  const response = await axiosInstance.post(API.AUTH.LOGIN, credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const encryptPasswords = async () => {
  const response = await axiosInstance.patch(API.AUTH.ENCRYPT_PWD);
  return response.data;
};

