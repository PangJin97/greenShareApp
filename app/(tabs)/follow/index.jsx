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
import CustomText from "../../../components/common/CustomText";
import FollowList from "./followList";
import ProfileButton from "../../../components/ProfileButton";
import ProfileImageViewer from "../../../components/ProfileImageViewer.jsx";
import { useSelector } from "react-redux";
import { getUserNameFromToken } from "../../../redux/authHelper.js";

const screenWidth = Dimensions.get("window").width;

const SerchHomeScreen = () => {
  const [post, setMyPost] = useState([]);
  /* userEmail을 받아오는 함수 */
  const [user, setUser] = useState(null); /* 유저를 받아올 통 */

  /* 유저이메일을 토큰에서 받아오는 함수 */
  const getUserEmailFromToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return null;

      const payload = token.split(".")[1];
      const decodedPayload = atob(payload); // base64 디코딩
      const decoded = JSON.parse(decodedPayload);
      console.log("Decoded email:", decoded.sub);
      return decoded.sub;
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
      return null;
    }
  };

  const getUserNameFromToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return null;

      const payload = token.split(".")[1];
      const decodedPayload = atob(payload); // base64 디코딩
      const decoded = JSON.parse(decodedPayload);
      console.log("Decoded name:", decoded.userName);
      return decoded.userName;
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
      return null;
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

  useFocusEffect(
    useCallback(() => {
      getUserEmailFromToken().then((userEmail) => {
        if (!userEmail) return;
        setUser(userEmail);
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
      {/* <FollowList userEmail={user} /> */}
      <View style={styles.proCon}>
        <ProfileImageViewer userEmail={user} />

        <View style={styles.fontCon}>
          <View>
            <CustomText weight="Bold" size={22}>
              {getUserNameFromToken()}
            </CustomText>
            <CustomText weight="Light" size={14} col="gray">
              {getUserEmailFromToken()}
            </CustomText>
          </View>
          <ProfileButton setUser={setUser}/>
        </View>
        <View style={styles.fontCon}>
          <View>
            <CustomText weight="Bold" size={22}>
              {getUserNameFromToken()}
            </CustomText>
            <CustomText weight="Light" size={14} col="gray">
              {getUserEmailFromToken()}
            </CustomText>
          </View>
          <ProfileButton />
        </View>

        {/* 컴포넌트로 만든 팔로우 리스트 */}
      </View>

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
    margin: 10,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: "0px 0px 6px lightgray",
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
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
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
  proCon: {
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  fontCon: {
    justifyContent: "space-around",
    height: 90,
    width: 120,
    gap: 10,
  },
});
