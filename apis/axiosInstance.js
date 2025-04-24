import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';



export const axiosInstance = axios.create({
  baseURL : Platform.OS === 'ios' ? 'http://localhost:8080': 'http://10.0.2.2:8080'

});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');

    //요청시 요청 헤더에 토큰을 담아서 서버에 전달
    if(token){
      config.headers.Authorization =token;
    }
    
    return config;

  }
  ,error => Promise.reject(error)
  )




























