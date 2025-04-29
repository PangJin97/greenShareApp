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


// 식물 커뮤니티 상세조회 API
export const getDetailStories = async (boardNum) => {
  const response = await axiosInstance.get(`/plantStories/${boardNum}`);
  return response;
};

// 식물 커뮤티니 삭제
export const deleteStories = async (boardNum) => {
  const response = await axiosInstance.delete(
    `/plantStories/${boardNum}`
  );
  return response.data; 
};

// 식물 커뮤티니 삭제
export const upDateStories = async (boardNum) => {
  const response = await axiosInstance.delete(
    `/plantStories/${boardNum}`
  );
  return response.data; 
};

