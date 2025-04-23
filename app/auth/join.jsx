import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import CustomInput from "../../components/common/CustomInput";
import CustomBotton from "../../components/common/CustomBotton";
import { api_join } from "../../apis/memberApi";

const Join = () => {
  const [data, setData] = useState({
    memEmail: "",
    memPw: "",
    memName: "",
  });

  const handleData = (text, name) => {
    setData({
      ...data,
      [name]: text,
    });
  };

  const join = () => {
    console.log(data);
    api_join(data)
      .then((res) => alert("성공"))
      .catch((error) => {
        console.log(e);
      });
    alert("전송");
  };

  return (
    <View>
      <View>
        <CustomInput
          label="아이디"
          value={data.memEmail}
          onChangeText={(text) => handleData(text, "memEmail")}
        />
      </View>
      <View>
        <CustomInput
          label="비밀번호"
          isPw={true}
          value={data.memPw}
          onChangeText={(text) => handleData(text, "memPw")}
        />
      </View>
      <View>
        <CustomInput
          label="이름"
          value={data.memName}
          onChangeText={(text) => handleData(text, "memName")}
        />
      </View>
      <CustomBotton label="회원가입" size="large" onPress={join} />
    </View>
  );
};

export default Join;

const styles = StyleSheet.create({});
