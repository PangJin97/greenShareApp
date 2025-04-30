import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { deleteLike, insertLike } from "../apis/plantStory";
import { Feather } from "@expo/vector-icons";
import { deleteFollows, insertFollows } from "../apis/follow";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomText from "./common/CustomText";
import Octicons from "@expo/vector-icons/Octicons";
import Profile from "./Profile";

const screenWidth = Dimensions.get("window").width;

const CommunityItem = ({ item, changeFollowStatus}) => {
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

  const extractImages = (htmlContent) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const images = [];
    let match;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
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
        text2: "좋아요를 누르려면 로그인해야 합니다.",
      });
      return;
    }

    try {
      if (isLiked) {
        await deleteLike(boardNum);
        setIsLiked(false);
        setSelectedItem((prevState) => ({
          ...prevState,
          likeCnt: prevState.likeCnt - 1,
        }));
      } else {
        await insertLike(boardNum);
        setIsLiked(true);
        setSelectedItem((prevState) => ({
          ...prevState,
          likeCnt: prevState.likeCnt + 1,
        }));
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
        Toast.show({
          type: "success",
          position: "top",
          text1: "팔로우 삭제됨",
          text2: "이제 팔로우하지 않습니다.",
        });
      } else {
        await insertFollows(selectedItem.userEmail);
        setIsFollowed(true);
        changeFollowStatus(selectedItem.userEmail);
        Toast.show({
          type: "success",
          position: "top",
          text1: "팔로우 완료",
          text2: "사용자를 팔로우했습니다.",
        });
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

  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.email}>
          {item.userEmail}</Text>
        <Pressable onPress={() => followInfo(item.boardNum)}>
          <View style={styles.followButton}>
            <Text style={styles.followText}>
              {isFollowed ? "팔로잉" : "팔로우"}
            </Text>
          </View>
        </Pressable>
      </View>

      {extractImages(item.content).map((imgUrl, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image
            source={{ uri: imgUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ))}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.preview}>
        {item.content.replace(/<[^>]+>/g, "").substring(0, 100)}...
      </Text>

      <View style={styles.iconContainer}>
        <Pressable onPress={() => handleLikeToggle(item.boardNum)}>
          <View style={styles.likeButton}>
            <Octicons
              name={isLiked ? "heart-fill" : "heart"}
              size={24}
              color="red"
            />
            <CustomText weight="Light" style={isLiked && { color: "red" }}>
            </CustomText>
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
  imageContainer: {
    width: screenWidth,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 8,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 10,
  },
  eyeText: {
    marginRight: 3,
    marginLeft: 8,
  },
  message: {
    flexDirection: "row",
    alignItems: "center",
  },
});
