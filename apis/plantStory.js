import { axiosInstance } from "./axiosInstance";

//식물 커무니티 조회 api
export const getStories = () => {
  const response = axiosInstance.get("/plantStories");
  return response;
};

//좋아요 기능 
export const insertLike = async (like) => {
  const response = await axiosInstance.post("/plantStories/like-insert", like);
  return response;
};