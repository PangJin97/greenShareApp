import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { getStories } from "../../../apis/plantStory";

// ✅ 화면 너비 가져오기 (스타일 밖에서 선언)
const screenWidth = Dimensions.get("window").width;

// HTML에서 첫 번째 이미지 src 추출하는 함수
const getFirstImageFromHtml = (html) => {
  const match = html.match(/<img[^>]+src=["']?([^"'>]+)["']?/);
  return match ? match[1] : null;
};

const ProfileHomeScreen = () => {
  const [boardList, setBoardList] = useState([]); // 게시물 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>커뮤니티</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView>
          {boardList.map((item, i) => {
            const imageUrl = getFirstImageFromHtml(item.content);

            return (
              <View key={i} style={styles.item}>
                {imageUrl && (
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.email}>{item.userEmail}</Text>
                <Text style={styles.preview}>
                  {item.content.replace(/<[^>]+>/g, "").substring(0, 50)}...
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

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
});


export default ProfileHomeScreen;
