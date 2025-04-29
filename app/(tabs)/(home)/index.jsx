import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomText from "../../../components/common/CustomText";
import Octicons from "@expo/vector-icons/Octicons";
import { Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../constants/colorConstant";
import FeedItem from "../../../components/FeedItem";
import { dummyData } from "../../../apis/dummyData";
import { router, useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();
  const data = dummyData;
  return (
    <View style={styles.con}>
      {/* 메인 컨테이너 */}
      <FlatList
        data={data} /* 반복할 데이터 */
        renderItem={({ item }) => (
          <FeedItem item={item} />
        )} /* 매개변수가 하나씩 뽑아서 쓰는 데이터명 */
        keyExtractor={(item) => {
          item.id.toString();
        }}
        contentContainerStyle={styles.listCon}
      />
      
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  con: {
    /* 메인 컨테이너 */ flex: 1,
    backgroundColor: "white",
  },
  listCon: {
    paddingVertical: 10,
  },
  writeBtn: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.MAIN,
    right: 5,
    bottom: 10,
  },
});
