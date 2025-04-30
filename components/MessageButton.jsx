import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router"; // 여기서는 expo-router의 Link를 사용해야 합니다.
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../constants/colorConstant";
import CustomText from "./common/CustomText";
import Feather from "@expo/vector-icons/Feather";

const MessageButton = ({ receiver }) => {
  const navigation = useNavigation();
  const [sender, setSender] = useState(null);

  const getUserEmailFromToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return null;

      const payload = token.split(".")[1]; // JWT 페이로드 추출
      const decoded = JSON.parse(atob(payload)); // Base64 디코딩 후 JSON 파싱

      setSender(decoded.sub); // sender 상태 업데이트
      return decoded.sub || null; // 이메일 필드가 있다면 반환, 없으면 null 반환
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
      return null;
    }
  };

  const goToPrac = () => {
    // `push`를 사용하여 쿼리 파라미터와 함께 이동
    navigation.navigate("follow/WebSocketClient", { sender, receiver });
  };

  useEffect(() => {
    getUserEmailFromToken();
  }, []); // 빈 배열을 의존성으로 사용하여 한 번만 실행

  return (
    <>
      <Pressable onPress={goToPrac} style={styles.dmBTN}>
        <CustomText col="white" weight="Bold">
          <Feather name="send" size={21} color="white" />
        </CustomText>
      </Pressable>
    </>
  );
};

export default MessageButton;

const styles = StyleSheet.create({
  dmBTN: {
    backgroundColor: colors.MAIN,
    borderRadius: 50,
    alignSelf: "flex-start",
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
