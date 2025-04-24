import axios from "axios";
import { Platform } from "react-native";
import { axiosInstance } from "./axiosInstance";

export const api_join = (data) => {
  const response = axiosInstance.post('/users/join', data);
  return response;
};

export const api_login = (loginData) => {
  const response = axiosInstance.post('/users/login', loginData);
  return response;
};

export const cropList = () => {
  const response = axiosInstance.get('/api/plants');
  // 'http://localhost:8080/images'?
  return response;
};

export const IMAGE_PATH = () => {
  const imgPath = axiosInstance.get('/images');
  return imgPath;
};

export const community = (boardList) => {
  const response = axiosInstance.post('/users/login', boardList);
  return response;
};