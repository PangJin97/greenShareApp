import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const axiosInstance = axios.create({
  baseURL:
    Platform.OS === "ios" ? "http://localhost:8080" : "http://10.0.2.2:8080",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      config.headers.Authorization = token;
    }
  },
  (error) => Promise.reject(all)
);
