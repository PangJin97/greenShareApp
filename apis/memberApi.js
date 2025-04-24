import axios from "axios";
import { Platform } from "react-native";
import { axiosInstance } from "./axiosInstance";

//회원가입 API
export const api_join = (data) => {
  const response = axiosInstance.post('/users/join', data);
  return response;
};
//로그인 API
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

//팔로우 목록 조회 API
export const follow = (fromUserEmail) => {
  return axiosInstance.get('/follow', {
    params: {
      fromUserEmail, 
    },
  });
};

//팔로우 취소 API
export const unfollowApi = (toUserEmail,fromUserEmail) => {
  return axiosInstance.delete('/follow/unfollow', {
    params: {
      fromUserEmail, 
      toUserEmail
    },
  });
};
