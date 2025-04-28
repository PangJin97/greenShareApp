import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const MessageButton = ({ receiver }) => {
  const [sender, setSender] = useState(null); /* 보내는 사람 설정 */
  const auth = useSelector((state) => state.auth);
  /* 보내는 사람을 알아내기 위해 토큰에서 아이디를 가져오기 위한 uesSelector */
  const navigation = useNavigation(); // 네비게이션 hook 사용

  useEffect(() => {
    try {
      // 로그인이 되어있을 시 sender 설정
      auth.token && setSender(getUserSubFromToken(auth.token));
    } catch {
      console.error("Error occurred while setting sender:", error);
      alert("로그인을 해주세요");
    }
  }, [auth.token]); /* 보내는 사람 설정 */

  const navChat = () => {
    if (sender && receiver) {
      navigation.navigate("WebSocketClient", { sender, receiver }); // sender와 receiver 파라미터 전달
    }
  };

  return (
    <Pressable onPress={navChat}>
      <Text>{receiver}와 대화하기</Text>
    </Pressable>
  );
};

export default MessageButton;

const styles = StyleSheet.create({});
