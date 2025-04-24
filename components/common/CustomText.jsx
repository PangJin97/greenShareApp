import { StyleSheet, Text, View } from "react-native";
import React from "react";

const CustomText = ({ weight = "Regular", style, children, ...props }) => {
  const fontMap = {
    Thin: "Pretendard-Thin",
    ExtraLight: "Pretendard-ExtraLight",
    Light: "Pretendard-Light",
    Regular: "Pretendard-Regular",
    Medium: "Pretendard-Medium",
    SemiBold: "Pretendard-SemiBold",
    Bold: "Pretendard-Bold",
    ExtraBold: "Pretendard-ExtraBold",
    Black: "Pretendard-Black",
  };

  return (
    <Text style={[{ fontFamily: fontMap[weight] }, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({});
