import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Header from "@/components/Header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const TabLayout = () => {
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
              title: "대쉬보드, 작물리스트",
              tabBarIcon: () => (
                <MaterialIcons name="dashboard" size={24} color="black" />
              ),
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
            name="deviceControl"
            options={{
              title: "(MQTT)기기제어",
              tabBarIcon: () => (
                <Octicons name="device-mobile" size={24} color="black" />
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
