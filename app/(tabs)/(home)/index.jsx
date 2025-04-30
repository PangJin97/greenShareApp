import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getPopularPosts } from "../../../apis/plantStory";
import RenderHtml from "react-native-render-html";
import { colors } from "../../../constants/colorConstant";

const screenWidth = Dimensions.get("window").width;

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
          resizeMode: "contain",
          borderRadius: 10,
          alignSelf: "center",
          marginVertical: 10,
        }}
      />
    );
  },
};

const HomeScreen = () => {
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <RenderHtml
        contentWidth={screenWidth * 0.9}
        source={{ html: `<h3>${item.title}</h3><p>${item.content}</p>` }}
        renderers={customRenderers}
        tagsStyles={{
          h3: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#34495e",
            marginBottom: 4,
          },
          p: {
            fontSize: 14,
            color: "#2d3436",
            lineHeight: 20,
          },
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
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
    backgroundColor: "white",
    padding: 16,
  },
  listCon: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
