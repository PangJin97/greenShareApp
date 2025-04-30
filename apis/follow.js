import { axiosInstance } from "./axiosInstance";

// 팔로우 등록 기능
export const insertFollows = async (toUserEmail) => {
  const response = await axiosInstance.post("/follow/insert", {'toUserEmail' : toUserEmail});
  return response;
};

// 팔로우 삭제 기능
export const deleteFollows = (toUserEmail,fromUserEmail) => {
  return axiosInstance.delete('/follow/unfollow', {
    params: {
      fromUserEmail, 
      toUserEmail
    },
  }); 
};
