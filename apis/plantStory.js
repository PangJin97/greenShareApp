import { axiosInstance } from "./axiosInstance";



// 식물 커뮤니티 조회 API
export const getStories = async () => {

    const response = await axiosInstance.get("/plantStories");
    return response;
  } 

//앱에서 내 글만 조회하기
export const getMyPost = (userEmail) => {
 const response = axiosInstance.get(`/plantStories/user/${userEmail}`);
 return response;
}

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
// 게시글 당 댓들 조회
export const replyList = async (boardNum) => {
  const response = await axiosInstance.get(`/plantReplies/${boardNum}`);
  return response;
};


