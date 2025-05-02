import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { deleteLike, insertLike } from "../apis/plantStory";
import { deleteFollows, insertFollows } from "../apis/follow";
import CustomText from "./common/CustomText";
import { Feather } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("window").width;

const CommunityItem = ({ item, changeFollowStatus }) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(null);
  const [followList, setFollowList] = useState({
    fromUserEmail: "",
    toUserEmail: "",
  });

  useEffect(() => {
    getUserEmailFromToken();
  }, []);

  const getUserEmailFromToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return null;
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      setFollowList({
        ...followList,
        toUserEmail: item.userEmail,
        fromUserEmail: decoded.sub,
      });
      return decoded.sub;
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
      return null;
    }
  };

  useEffect(() => {
    setSelectedItem(item);
    setIsLiked(item.isLike === "Y");
    setIsFollowed(item.isFollow === "Y");
  }, [item]);

  const followInfo = async (boardNum) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "로그인 필요",
        text2: "팔로우를 누르려면 로그인해야 합니다.",
      });
      return;
    }

    try {
      if (isFollowed) {
        await deleteFollows(followList.toUserEmail, followList.fromUserEmail);
        setIsFollowed(false);
        changeFollowStatus(selectedItem.userEmail);
      } else {
        await insertFollows(selectedItem.userEmail);
        setIsFollowed(true);
        changeFollowStatus(selectedItem.userEmail);
      }
    } catch (error) {
      console.error("팔로우 처리 중 오류:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "팔로우 처리 실패",
        text2: "잠시 후 다시 시도해주세요.",
      });
    }
  };

  const extractImages = (content) => {
    const regex = /<img[^>]+src=\"([^">]+)\"/g;
    const images = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      images.push(match[1]);
    }
    return images;
  };

  const handleLikeToggle = async (boardNum) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "로그인 필요",
        text2: "좋아요를 눌르려면 로그인해야 합니다.",
      });
      return;
    }

    try {
      if (isLiked) {
        await deleteLike(boardNum);
        setIsLiked(false);
      } else {
        await insertLike(boardNum);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "좋아요 처리 실패",
        text2: "잠시 후 다시 시도해주세요.",
      });
    }
  };

  const thumbnail = extractImages(item.content)[0];

  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.email}>{item.userEmail}</Text>
        {item.userEmail === followList.fromUserEmail ? null : (
          <Pressable onPress={() => followInfo(item.boardNum)}>
            <View style={[styles.followButton, isFollowed && styles.followingButton]}>
              <Text style={[styles.followText, isFollowed && styles.followingText]}>
                {isFollowed ? "팔로잉" : "팔로우"}
              </Text>
            </View>
          </Pressable>
        )}
      </View>

      {thumbnail && (
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        </View>
      )}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.preview}>
        {item.content.replace(/<[^>]+>/g, "").substring(0, 100)}
      </Text>

      <View style={styles.iconContainer}>
        <Pressable onPress={() => handleLikeToggle(item.boardNum)}>
          <View style={styles.likeButton}>
            <Octicons
              name={isLiked ? "heart-fill" : "heart"}
              size={24}
              color="red"
            />
            <CustomText weight="Light" style={isLiked && { color: "red" }} />
            <Text style={styles.likeCount}>{selectedItem.likeCnt}</Text>
          </View>
        </Pressable>

        <View style={styles.message}>
          <Feather
            name="message-circle"
            size={24}
            color="black"
            style={{ transform: [{ scaleX: -1 }] }}
          />
          <Text style={{ marginLeft: 4 }}>{item.replyCnt}</Text>
        </View>

        <View style={styles.viewCountContainer}>
          <MaterialCommunityIcons name="eye-outline" size={24} color="black" />
          <CustomText style={styles.eyeText}>{item.readCnt}</CustomText>
        </View>
      </View>
    </View>
  );
};

export default CommunityItem;

const styles = StyleSheet.create({
  item: {
    marginBottom: 16,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  email: {
    fontSize: 17,
  },
  followButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    width: 70,
  },
  followText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  thumbnailContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  thumbnail: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 12,
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: "#444",
  },
  iconContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  likeCount: {
    marginLeft: 5,
  },
  viewCountContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 4,
    marginLeft: 10,
  },
  eyeText: {
    marginRight: 3,
    marginLeft: 8,
  },
  message: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  followingButton: {
    backgroundColor: "#2ab170",
    borderWidth: 0,
  },
  followingText: {
    color: "white",
  },
});