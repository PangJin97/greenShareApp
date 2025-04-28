import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Octicons from "@expo/vector-icons/Octicons";
import { Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomText from "./common/CustomText";
import { colors } from "../constants/colorConstant";
import Profile from "./Profile";

const FeedItem = ({ item }) => {
  const [isLike, setLike] = useState(false);
  const like = () => {
    if (isLike) {
      setLike(false);
    } else {
      setLike(true);
    }
  };
  useEffect(() => {}, [isLike]);
  return (
    <View style={styles.feedCon}>
      {/* 피드 컨테이너 */}
      <Profile writer={item.writer} regData={item.regData} />
      {/* 프로필 컴포넌트 */}
      <CustomText weight="Bold" size={15}>
        {/* 글제목 */}
        {item.title}
      </CustomText>
      <CustomText weight="Regular" size={15} numberOfLines={2}>
        {/* 글 내용 */}
        {item.content}
      </CustomText>
      <View style={styles.subCon}>
        {/* 메뉴 컨테이너 */}
        {/* 구분선 */}
        <Pressable onPress={like} style={styles.flexRow}>
          {/* 하트 아이콘 */} {/* 좋아요 눌렀을때 */}
          <Octicons
            name={isLike ? "heart-fill" : "heart"}
            size={16}
            color="red"
          />
          <CustomText weight="Light" style={isLike && { color: "red" }}>
            {item.likeCnt}
          </CustomText>
        </Pressable>
        <Pressable style={styles.flexRow}>
          {/* 댓글부분 */}
          <Octicons name="comment" size={16} color="black" />
          <CustomText weight="Light">{item.replyCnt}</CustomText>
        </Pressable>
        <Pressable style={styles.flexRow}>
          {/* 조회수 */}
          <MaterialCommunityIcons name="eye-outline" size={16} color="black" />
          <CustomText weight="Light">{item.readCnt}</CustomText>
        </Pressable>
      </View>
    </View>
  );
};

export default FeedItem;

const styles = StyleSheet.create({
  feedCon: {
    /* 피드 컨테이터 */
    margin: 10,
    padding: 12,
    boxShadow: "0px 0px 6px lightgray",
    borderRadius: 10,
  },
  subCon: {
    /*  */ flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.GRAY_500,
  },
  flexRow: {
    /* 아이콘에 적용되는 css */
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 5,
  },
});
