import { Dimensions, Image, Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from "react-native-vector-icons/FontAwesome"; // FontAwesome 아이콘 사용
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';
import { deleteLike, insertLike } from '../apis/plantStory';
import { Feather } from '@expo/vector-icons'; // Feather 아이콘을 @expo/vector-icons에서 임포트

// 화면 너비 가져오기
const screenWidth = Dimensions.get("window").width;

const CommunityItem = ({ item }) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태

  useEffect(() => {
    // 초기 상태 설정 (isLike 값에 따라서 좋아요 상태를 설정)
    setSelectedItem(item);
    setIsLiked(item.isLike === 'Y');
  }, [item]);

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
    if (!token) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: '로그인 필요',
        text2: '좋아요를 누르려면 로그인해야 합니다.'
      });
      return;
    }
  
    try {
      if (isLiked) {
        // 좋아요 취소 처리
        await deleteLike(boardNum);
        setIsLiked(false);
        setSelectedItem((prevState) => ({
          ...prevState,
          likeCnt: prevState.likeCnt - 1, // 좋아요 수 감소
        }));
      } else {
        // 좋아요 추가 처리
        await insertLike(boardNum);
        setIsLiked(true);
        setSelectedItem((prevState) => ({
          ...prevState,
          likeCnt: prevState.likeCnt + 1, // 좋아요 수 증가
        }));
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: '좋아요 처리 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });
    }
  };
  


  return (
    <View style={styles.item}>
      <Text style={styles.email}>{item.userEmail}</Text>

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

      {/* 좋아요 버튼 */}
      <View style={styles.iconContainer}>
        <Pressable onPress={() => handleLikeToggle(item.boardNum)}>
          <View style={styles.likeButton}>
            <Icon
              name={isLiked ? "heart" : "heart-o"}
              size={24}
              color={isLiked ? "red" : "gray"}
            />
            <Text style={styles.likeCount}>{selectedItem.likeCnt}</Text>
          </View>
        </Pressable>

        {/* 메시지 아이콘 버튼 */}
        <Pressable  style={styles.messageButton}>
          <Feather name="message-circle" size={24} color="black" />
        </Pressable>
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
  email: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  imageContainer: {
    width: screenWidth,
    marginBottom: 12,
  },
  image: {
    width: '100%',
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
    flexDirection: 'row',
    alignItems: 'center'
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  likeCount: {
    marginLeft: 5,
  },
  messageButton: {
    transform: [{ scaleX: -1 }],
  },
});
