import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { colors } from "../../constants/colorConstant";

const CustomInput = ({ label, isPw = false, ...props }) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.con}>
        <TextInput 
          style={styles.input} 
          secureTextEntry={isPw}
          {...props} />
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: colors.MAIN,
  },

  con: {
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.GRAY_500,
  },

  input: {
    fontSize: 16,
    flex: 1,
  },
});
