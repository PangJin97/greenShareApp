import axios from "axios";
import { Platform } from "react-native";

export const api_join = (data) => {
  const baseUrl =
    Platform.OS === "ios" ? "http://localhost:8080" : "http://10.0.2.2:8080";
  const response = axios.post(`${baseUrl}/users/join`, data);
  return response;
};

export const api_login = (loginData) => {
  const baseUrl =
    Platform.OS === "ios" ? "http://localhost:8080" : "http://10.0.2.2:8080";
  const response = axios.post(`${baseUrl}/users/login`, loginData);
  return response;
};

export const cropList = () => {
  const baseUrl =
    Platform.OS === "ios" ? "http://localhost:8080" : "http://10.0.2.2:8080";
  const response = axios.get(`${baseUrl}/api/plants`);
  // 'http://localhost:8080/images'?
  return response;
};

export const IMAGE_PATH = () => {
  const baseUrl =
    Platform.OS === "ios" ? "http://localhost:8080" : "http://10.0.2.2:8080";
  const imgPath = axios.get(`${baseUrl}/images`);
  return imgPath;
};
