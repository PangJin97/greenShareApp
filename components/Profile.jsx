import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomText from "./common/CustomText";
import face from "@/assets/images/face-01.jpg";
import Ionicons from "@expo/vector-icons/Ionicons";

const Profile = ({ writer, regData }) => {
  /* 프로필영역 컴포넌트 */
  return (
    <View style={styles.con}>
      {/* 프로필 컴포넌트 전체 컨테이너 */}
      <View style={styles.profileCon}>
        {/* 이미지 영역 */}
        <Image source={face} style={styles.img} />
        <View style={{ gap: 0 }}>
          <CustomText weight="Bold" size={17}>
            {writer}
          </CustomText>
          <CustomText weight="Light" size={11}>
            {regData}
          </CustomText>
        </View>
      </View>
      {/* 이름 */}
      <View>
        <Ionicons name="ellipsis-horizontal-sharp" size={16} color="black" />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  con: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  profileCon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
