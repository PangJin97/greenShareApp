



import logo from "@/assets/images/greenshare.png";
import { startMapper } from "react-native-reanimated";
import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux';
import { getUserNameFromToken, getUserSubFromToken } from '../redux/authHelper';
import * as SecureStore from 'expo-secure-store';
import { logoutReducer } from '../redux/authSlice';


const Header = () => {
  const router = useRouter();
  const auth = useSelector((state) => state.auth); //{token : null, isLogin : false}
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    SecureStore.deleteItemAsync("accessToken")
      .then(() => {
        console.log("SecureStore 삭제 완료");
        dispatch(logoutReducer());
        router.replace("/");
      })
      .catch((error) => console.error("SecureStore 오류:", error));
  };

  return (
    <View style={styles.headerContainer}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.loginStatus}>
        {auth.isLogin ? (
          <>
            <Text>{getUserNameFromToken(auth.token)} 님 반갑습니다.</Text>

            <Pressable onPress={handleLogout}>
              <Text>로그아웃</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={() => router.push("/auth/login")}>
              <Text>Login</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/auth/join")}>
              <Text>Join</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    height: 30,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  loginStatus: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingRight: 12,
  },
  logo: {
    // 원하는 너비
    height: 25, // 원하는 높이, 비율에 맞게 대략 맞춰서 지정

    width: 130,
  },
});
