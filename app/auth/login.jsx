import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CustomInput from "./../../components/common/CustomInput";
import CustomBotton from "./../../components/common/CustomBotton";
import { api_login } from "../../apis/memberApi";

const Login = () => {
  const [data, setData] = useState({
    memEmail: "",
    memPw: "",
  });

  const loginData = (text, name) => {
    setData({
      ...data,
      [name]: text,
    });
  };

  const login = () => {
    api_login(data)
      .then((res) => {
        const token = res.headers.authorization;
        console.log(token);
      })
      .catch((e) => console.log(e));
  };
  return (
    <View>
      <CustomInput
        label={"아이디"}
        value={data.memEmail}
        onChangeText={(text) => loginData(text, "memEmail")}
      />
      <CustomInput
        label={"비밀번호"}
        value={data.memPw}
        isPw={true}
        onChangeText={(text) => loginData(text, "memPw")}
      />
      <CustomBotton
        label="로그인"
        onPress={() => {
          login();
        }}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
