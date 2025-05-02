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
import dayjs from "dayjs";

const screenWidth = Dimensions.get("window").width;

// 첫 번째 이미지를 추출하는 유틸 함수
const extractThumbnail = (html) => {
  const regex = /<img[^>]+src=\"([^\">]+)\"/i;
  const match = regex.exec(html);
  return match?.[1] ?? null;
};

const HomeScreen = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const renderItem = ({ item }) => {
    const thumbnail = extractThumbnail(item.content);
    const textContent = item.content.replace(/<[^>]+>/g, "").slice(0, 60) + "...";

    return (
      <TouchableOpacity
        onPress={() => router.push(`/community/${item.boardNum}`)}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            {thumbnail && (
              <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
            )}
            <View style={styles.textBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.preview}>{textContent}</Text>
            </View>
          </View>

          <View style={styles.metaContainer}>
            <Text style={styles.meta}>작성자: {item.userEmail}</Text>
            <Text style={styles.meta}>❤️ {item.likeCnt}개</Text>
            <Text style={styles.meta}>
              📅 {dayjs(item.regDate).format("YYYY.MM.DD")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌿 오늘의 인기글 Top10 (좋아요 기준)</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b6342" />
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
    backgroundColor: "#edf7ef",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3b6342",
    marginBottom: 20,
    textAlign: "center",
  },
  listCon: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#c9e4ca",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  textBox: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c5f2d",
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: "#444",
  },
  metaContainer: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  meta: {
    fontSize: 13,
    color: "#5e7b61",
    marginBottom: 3,
  },
});