import { axiosInstance } from "./axiosInstance";

// 식물 커뮤니티 조회 API
export const getStories = async () => {
 
    const response = await axiosInstance.get("/plantStories");
    return response;
  } 

// 좋아요 기능
export const insertLike = async (boardNum) => {
  const response = await axiosInstance.post("/plantStories/like-insert", {
    boardNum
  });
  return response;
};

// 좋아요 취소 기능
export const deleteLike = async (boardNum) => {
  const response = await axiosInstance.delete(
    `/plantStories/like-delete/${boardNum}`
  );
  return response.data; 
};

//async는 비동기작업이라는 뜻으로 await는 실행될때까지 기다린다는 의미
