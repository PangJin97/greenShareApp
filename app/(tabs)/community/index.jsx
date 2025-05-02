import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Alert,
  Pressable,
} from "react-native";
import { getStories, removeLike } from "../../../apis/plantStory";
import {
  getUserRoleFromToken,
  getUserSubFromToken,
} from "../../../redux/authHelper";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';  // Toast import
import CommunityItem from "../../../components/CommunityItem";
import { useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { LinearGradient } from 'expo-linear-gradient';



// 화면 너비 가져오기
const screenWidth = Dimensions.get("window").width;


const ProfileHomeScreen = () => {

  const router = useRouter(); 
  const [boardList, setBoardList] = useState([]); // 게시물 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [userEmail, setUserEmail] = useState(null); // 사용자 이메일 상태
  const [userRole, setUserRole] = useState(null); // 사용자 역할 상태
  //const [likeLoading, setLikeLoading] = useState({}); // 각 게시물의 좋아요 요청 상태 관리


  // 사용자 정보 가져옴
  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        try {
          const token = await SecureStore.getItemAsync("accessToken");
  
          if (token) {
            const email = getUserSubFromToken(token);
            const role = getUserRoleFromToken(token);
  
            setUserEmail(email);
            setUserRole(role);
          }
        } catch (error) {
          console.error("사용자 정보 로드 실패:", error);
          Alert.alert("오류", "사용자 정보를 가져오는 데 실패했습니다.");
        }
      };
  
      fetchUserInfo();
    }, [])
  ); // 빈 배열로, 컴포넌트가 마운트될 때 한 번만 실행

  // 게시물 목록 가져오기
  useFocusEffect(
    useCallback(() => {
      const fetchStories = async () => {
        setLoading(true);
        try {
          const response = await getStories();
          setBoardList(response.data);
        } catch (error) {
          alert("오류", "게시물 목록을 가져오는 데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchStories();
    }, [])
  );

  // 팔로우 바뀌면 화면에 반영
  const changeFollowStatus = (followId) => {
    
    const newBoardList = boardList.map(item => {
      if (item.userEmail === followId) {
        return {
          ...item,
          isFollow: item.isFollow === 'Y' ? 'N' : 'Y'
        };
      }
      return item;
    });

    setBoardList([...newBoardList]);
  }


  return (

  <LinearGradient
   colors={['#D1FAE5', '#A7F3D0']} // ✅ 연한 민트-연두
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.container}
  >
    <Text style={styles.header}>Plant Story</Text>

    {loading ? (
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    ) : (
      <FlatList
        data={boardList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              router.push({
                pathname: '/community/detail',
                params: { boardNum: item.boardNum },
              });
            }}
          >
            <CommunityItem item={item} changeFollowStatus={changeFollowStatus} />
          </Pressable>
        )}
        keyExtractor={(item) => item.boardNum.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

    )}

    <Pressable style={styles.writeBtn} onPress={() => router.push('/community/reg-commu')}>
      <Octicons name="pencil" size={28} color="white" />
    </Pressable>
  </LinearGradient>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E6F4EC", // 식물 커뮤니티에 어울리는 연한 초록 배경
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32", // 짙은 녹색 계열
    marginBottom: 20,
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
  item: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C8E6C9", // 연한 그린 테두리
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "#6B8E23",
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: "#4E5D52",
  },
  imageContainer: {
    width: screenWidth - 32,
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
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
    color: "#555",
  },
  writeBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#66BB6A", // 밝은 그린
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    // shadow 제거
  },
});


export default ProfileHomeScreen;
