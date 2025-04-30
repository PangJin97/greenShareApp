import { axiosInstance } from "./axiosInstance";

// 식물 커뮤니티 조회 API
export const getStories = async () => {
 
    const response = await axiosInstance.get("/plantStories");
    return response;
  } 

// 좋아요 등록 기능
export const insertLike = async (boardNum) => {
  const response = await axiosInstance.post("/plantStories/like-insert", {
    boardNum
  });
  return response;
};

// 좋아요 삭제 기능
export const deleteLike = async (boardNum) => {
  const response = await axiosInstance.delete(
    `/plantStories/like-delete/${boardNum}`
  );
  return response 
};


