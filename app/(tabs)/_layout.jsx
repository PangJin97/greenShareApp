import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs, useRouter } from "expo-router";
import Header from "@/components/Header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useSelector } from "react-redux";
import { getUserRoleFromToken } from "../../redux/authHelper";

const TabLayout = () => {
  const auth = useSelector((state) => state.auth);
  const router = useRouter();

  // 로그인이 필요한 탭 목록
  const protectedTabs = ["adminDashboard", "deviceControl", "follow"]; // 로그인이 필요한 탭 이름들

  // 탭 접근 권한 확인 함수
  const checkAuthForTab = (tabName) => {
    if (protectedTabs.includes(tabName) && !auth.isLogin) {
      //
      console.log(`${tabName} 탭은 로그인이 필요합니다`);
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.tabArea}>
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen
            name="(home)"
            options={{
              title: "홈",
              tabBarIcon: () => (
                <MaterialIcons name="home" size={24} color="black" />
              ),
            }}
          />

          {auth.role === "ROLE_ADMIN" && (
            <Tabs.Screen
              name="adminDashboard"
              options={{
                title: "대쉬보드, 작물리스트",
                tabBarIcon: () => (
                  <MaterialIcons name="dashboard" size={24} color="black" />
                ),
              }}
              listeners={{
                tabPress: (e) => {
                  if (!checkAuthForTab("adminDashboard")) {
                    // 기본 탭 이벤트 방지
                    e.preventDefault();
                    // 로그인 페이지로 이동
                    router.push("/auth/login");
                  }
                },
              }}
            />
          )}

          <Tabs.Screen
            name="community"
            options={{
              title: "커뮤니티",
              tabBarIcon: () => (
                <MaterialIcons name="wechat" size={24} color="black" />
              ),
            }}
          />

          <Tabs.Screen
            name="follow"
            options={{
              title: "팔로우",
              tabBarIcon: () => (
                <SimpleLineIcons name="user-follow" size={24} color="black" />
              ),
            }}
            listeners={{
              tabPress: (e) => {
                if (!checkAuthForTab("follow")) {
                  // 기본 탭 이벤트 방지
                  e.preventDefault();
                  // 로그인 페이지로 이동
                  router.push("/auth/login");
                }
              },
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabArea: {
    flex: 1,
  },
});
