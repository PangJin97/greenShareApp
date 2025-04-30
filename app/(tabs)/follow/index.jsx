import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { follow, unfollowApi } from "../../../apis/memberApi";
import * as SecureStore from "expo-secure-store";
import { decode as atob } from "base-64";
import MessageButton from "../../../components/MessageButton";
import { getMyPost } from "../../../apis/plantStory";
import { useFocusEffect } from "expo-router";
import RenderHtml from "react-native-render-html";

const screenWidth = Dimensions.get("window").width;

const SerchHomeScreen = () => {
  const [followList, setFollowList] = useState([]);
  const [post, setMyPost] = useState([]);

  const getUserEmailFromToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return null;
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub;
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
      return null;
    }
  };

  const FollowLists = (userEmail) => {
    follow(userEmail)
      .then((res) => {
        setFollowList(res.data);
      })
      .catch((error) => {
        console.log("팔로우 API 오류:", error);
      });
  };

  const unfollow = async (toUserEmail) => {
    const fromUserEmail = await getUserEmailFromToken();
    if (!fromUserEmail) return;

    try {
      await unfollowApi(toUserEmail, fromUserEmail);
      setFollowList((prevList) =>
        prevList.filter((user) => user.toUserEmail !== toUserEmail)
      );
    } catch (err) {
      console.log("언팔로우 오류:", err);
    }
  };

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

  useEffect(() => {
    const fetchFollow = async () => {
      const userEmail = await getUserEmailFromToken();
      if (!userEmail) return;

      console.log(userEmail);

      FollowLists(userEmail);
    };

    fetchFollow();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUserEmailFromToken().then((userEmail) => {
        if (!userEmail) return;
        getMyPost(userEmail)
          .then((res) => {
            setMyPost(res.data);
          })
          .catch((err) => {
            console.log("내 글 가져오기 오류:", err);
          });
      });
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>팔로우 목록</Text>

      <FlatList
        data={followList}
        keyExtractor={(item) => item.toUserEmail}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>📧 이메일</Text>
                <Text style={styles.email}>{item.toUserEmail}</Text>
              </View>

              <MessageButton receiver={item.toUserEmail} />
              <TouchableOpacity
                style={styles.unfollowBtn}
                onPress={() => unfollow(item.toUserEmail)}
              >
                <Text style={styles.unfollowText}>언팔로우</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>팔로우한 사용자가 없습니다.</Text>
        }
        scrollEnabled={false}
      />

      <Text style={styles.title}>내가 작성한 글</Text>

      <FlatList
        data={post}
        keyExtractor={(item) => item.boardNum.toString()} 
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>제목</Text>
            <Text style={styles.email}>{item.title}</Text>

            <Text style={styles.label}>내용</Text>
            <RenderHtml
              contentWidth={screenWidth * 0.9}
              source={{ html: item.content }}
              renderers={customRenderers}
              tagsStyles={{
                p: {
                  fontSize: 14,
                  color: "#2d3436",
                  lineHeight: 20,
                  marginBottom: 8,
                },
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>작성한 글이 없습니다.</Text>
        }
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default SerchHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2f3542",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "500",
    color: "#34495e",
  },
  empty: {
    color: "#b0b0b0",
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
  unfollowBtn: {
    marginTop: 10,
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  unfollowText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
