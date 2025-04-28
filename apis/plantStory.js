import { axiosInstance } from "./axiosInstance";

// 식물 커뮤니티 조회 API
export const getStories = async () => {
  try {
    const response = await axiosInstance.get("/plantStories");
    return response; // 응답을 그대로 반환
  } catch (error) {
    console.error("게시물 조회 실패:", error);
    throw error; // 실패 시 에러를 던짐
  }
};

// 좋아요 기능
export const insertLike = async (like) => {
  const response = await axiosInstance.post("/plantStories/like-insert", like);
  return response;
};


export const removeLike = async (disLike) => {
  try {
    const response = await axiosInstance.delete(`/plantStories/like-delete/${disLike}`);
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("좋아요 취소 실패:", error);
    throw error; // 실패 시 에러 던짐
  }
};

