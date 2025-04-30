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
  const userRole = getUserRoleFromToken(auth.token);


  
  // 로그인이 필요한 탭 목록
  const protectedTabs = ["adminDashboard", "deviceControl", "follow"]; // 로그인이 필요한 탭 이름들

   // 관리자 전용 탭
  const adminOnlyTabs = ["adminDashboard"];

  // 탭 접근 권한 확인 함수
  const checkAuthForTab = (tabName) => {
    if (!auth.isLogin) {
      console.log(`${tabName} 탭은 로그인이 필요합니다`);
      return false;
    }
  
    if (adminOnlyTabs.includes(tabName) && userRole !== "ROLE_ADMIN") {
      console.log(`${tabName} 탭은 관리자만 접근할 수 있습니다`);
      return false;
    }
  
    return true;
  };
  
  console.log("userRole:", userRole);

  

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


<Tabs.Screen
  name="adminDashboard"
  options={{
    title: "대쉬보드",
    tabBarIcon: () => (
      <MaterialIcons name="dashboard" size={24} color="black" />
    ),
    tabBarStyle: userRole === "ROLE_ADMIN" ? undefined : { display: "none" }, // ❗ 탭 바에서 숨기기
  }}
  listeners={{
    tabPress: (e) => {
      if (!checkAuthForTab("adminDashboard")) {
        e.preventDefault();
        alert("관리자 권한이 필요합니다.");
        router.push("/auth/login");
      }
    },
  }}
/>





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
              title: "마이페이지",
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
