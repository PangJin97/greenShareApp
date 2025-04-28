import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getStories, insertLike, removeLike } from "../../../apis/plantStory";
import {
  getUserRoleFromToken,
  getUserSubFromToken,
} from "../../../redux/authHelper";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome"; // FontAwesome 아이콘 사용

// 화면 너비 가져오기
const screenWidth = Dimensions.get("window").width;

const ProfileHomeScreen = () => {
  const [boardList, setBoardList] = useState([]); // 게시물 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [userEmail, setUserEmail] = useState(null); // 사용자 이메일 상태
  const [userRole, setUserRole] = useState(null); // 사용자 역할 상태
  const [likeLoading, setLikeLoading] = useState({}); // 각 게시물의 좋아요 요청 상태 관리

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // SecureStore에서 토큰 가져오기
        const token = await SecureStore.getItemAsync("accessToken");

        if (token) {
          // 토큰에서 이메일과 역할 정보 추출
          const email = getUserSubFromToken(token); // 이메일
          const role = getUserRoleFromToken(token); // 역할

          setUserEmail(email); // 상태 업데이트
          setUserRole(role); // 상태 업데이트
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        Alert.alert("오류", "사용자 정보를 가져오는 데 실패했습니다.");
      }
    };

    fetchUserInfo(); // 실행
  }, []); // 빈 배열로, 컴포넌트가 마운트될 때 한 번만 실행

  // 게시물 목록 가져오기
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await getStories(); // API 호출
        setBoardList(response.data); // 상태 업데이트
      } catch (error) {
        console.error(error);
        Alert.alert("오류", "게시물 목록을 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchStories(); // 실행
  }, []);

  // HTML 콘텐츠에서 이미지 URL만 추출하는 함수
  const extractImages = (htmlContent) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const images = [];
    let match;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      images.push(match[1]);
    }
    return images;
  };

  // 좋아요 처리 함수
  const handleLikeToggle = async (boardNum) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!isAuthenticated(token)) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (likeLoading[boardNum]) return; // 요청 중이면 클릭 무효화

    setLikeLoading((prev) => ({ ...prev, [boardNum]: true }));

    try {
      // 게시물의 현재 좋아요 상태 확인
      const currentLikeStatus = boardList.find(
        (item) => item.boardNum === boardNum
      ).isLike === "Y"; // 'Y'는 좋아요 상태, 'N'은 비활성화 상태

      if (currentLikeStatus) {
        // 좋아요 취소
        await removeLike(boardNum); // deleteLike는 서버에서 좋아요를 취소하는 API 호출 함수
      } else {
        // 좋아요 추가
        await insertLike(boardNum); // addLike는 서버에서 좋아요를 추가하는 API 호출 함수
      }

      // 게시물의 좋아요 상태와 카운트 업데이트
      setBoardList((prevList) =>
        prevList.map((item) =>
          item.boardNum === boardNum
            ? {
                ...item,
                isLike: currentLikeStatus ? "N" : "Y", // 좋아요 상태 토글
                likeCnt: currentLikeStatus ? item.likeCnt - 1 : item.likeCnt + 1, // 좋아요 카운트 업데이트
              }
            : item
        )
      );
    } catch (error) {
      Alert.alert("오류", "좋아요 처리에 실패했습니다.", error);
    } finally {
      setLikeLoading((prev) => ({ ...prev, [boardNum]: false }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>커뮤니티</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={boardList}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.email}>{item.userEmail}</Text>

              {extractImages(item.content).map((imgUrl, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: imgUrl }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
              ))}

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.preview}>
                {item.content.replace(/<[^>]+>/g, "").substring(0, 100)}...
              </Text>

              {/* 좋아요 버튼 */}
              <TouchableOpacity
                onPress={() => handleLikeToggle(item.boardNum)}
                disabled={likeLoading[item.boardNum]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name={item.isLike === "Y" ? "heart" : "heart-o"}
                    size={24}
                    color={item.isLike === "Y" ? "red" : "gray"}
                  />
                  <Text style={{ marginLeft: 5 }}>{item.likeCnt}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.boardNum.toString()}
        />
      )}
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
  item: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: "#444",
  },
  imageContainer: {
    width: screenWidth - 32,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 8,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  likeCount: {
    marginLeft: 8,
    fontSize: 16,
    color: "#444",
  },
});

export default ProfileHomeScreen;
