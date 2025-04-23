import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Login from "./../app/auth/login";
import { useRouter } from "expo-router";
import { colors } from "../constants/colorConstant";

const Header = () => {
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Header</Text>
      <View style={styles.loginStatus}>
        <Pressable onPress={() => router.push("/auth/login")}>
          <Text>Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/auth/join")}>
          <Text>Join</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    backgroundColor: colors.MAIN,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
  },
  loginStatus: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingRight: 12,
  },
});
