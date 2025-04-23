import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../constants/colorConstant";

const CustomBotton = ({ label = "버튼", size = "large", ...props }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.mainCon,
        styles[size],
        pressed && styles.pressed,
      ]}
      {...props}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default CustomBotton;

const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: colors.MAIN,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  large: {
    width: "100%",
    height: 45,
  },

  normal: {
    width: "70%",
    height: 40,
  },

  label: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },

  pressed: {
    opacity: 0.7,
  },
});
