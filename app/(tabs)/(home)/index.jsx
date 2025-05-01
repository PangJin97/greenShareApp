import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { getPopularPosts } from "../../../apis/plantStory";
import RenderHtml from "react-native-render-html";
import { colors } from "../../../constants/colorConstant";
import dayjs from "dayjs";

const screenWidth = Dimensions.get("window").width;

// 🌿 이미지 렌더러 (RenderHtml에서 이미지 태그 처리)
const customRenderers = {
  img: ({ tnode }) => {
    const imageUri = tnode.attributes.src;
    if (!imageUri) return null;
    return (
      <Image
        source={{ uri: imageUri }}
        style={{
          width: screenWidth * 0.9,
          height: 200,
          resizeMode: "cover",
          borderRadius: 8,
          alignSelf: "center",
          marginVertical: 10,
        }}
      />
    );
  },
};

const HomeScreen = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 화면이 포커스 될 때마다 인기글 새로 불러오기
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getPopularPosts()
        .then((res) => {
          setPosts(res.data);
        })
        .catch((err) => {
          console.error("인기글 조회 실패:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [])
  );

  // 🧾 게시글 카드 렌더링
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/community/${item.boardNum}`)} // 상세 페이지로 이동
    >
      <View style={styles.card}>
        <RenderHtml
          contentWidth={screenWidth * 0.9}
          source={{ html: `<h3>${item.title}</h3><p>${item.content}</p>` }}
          renderers={customRenderers}
          tagsStyles={{
            h3: {
              fontSize: 18,
              fontWeight: "bold",
              color: "#2c5f2d",
              marginBottom: 8,
            },
            p: {
              fontSize: 15,
              color: "#3d3d3d",
              lineHeight: 22,
            },
          }}
        />
        <View style={styles.metaContainer}>
          <Text style={styles.meta}>작성자: {item.userEmail}</Text>
          <Text style={styles.meta}>❤️ 좋아요 {item.likeCnt}</Text>
          <Text style={styles.meta}>
            📅 {dayjs(item.regDate).format("YYYY.MM.DD")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌿 오늘의 인기글 Top10 (좋아요 기준)</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.MAIN} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.boardNum.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listCon}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4fbe8", // 연초록 배경
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c5f2d",
    marginBottom: 16,
    textAlign: "center",
  },
  listCon: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1, // ✅ 그림자 대신 선
    borderColor: "#cdeac0", // 연한 초록 테두리
  },
  metaContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  meta: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
});
