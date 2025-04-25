import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { api_login } from "../../apis/memberApi";
import {  useRouter } from 'expo-router';
import { useDispatch } from "react-redux";
import * as SecureStore from 'expo-secure-store';
import { loginReducer } from '../../redux/authSlice'




const Login = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    userEmail: "",
    userPassword: "",
    userName : "",
    userRole : ""

  });

  const loginData1 = (text, name) => {
    setLoginData({
      ...loginData,
      [name]: text,
    });
  };

  const login = () => {
    api_login(loginData)
      .then((res) => {
        const token = res.headers.authorization;
        const user = res.data.user; 
  
        SecureStore.setItemAsync('accessToken', token)
          .then(() => {
            dispatch(loginReducer({
              token: token,
              user: user,
            }));
            console.log(loginData);
            router.navigate('/');
          })
          .catch(e => console.log("토큰 저장 오류:", e));
      })
      .catch((e) => console.log("로그인 요청 실패:", e));
  };
  
  return (

    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <Text style={styles.login}>LOGIN</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="이메일 입력하세요"
            value={loginData.userEmail}
            onChangeText={(text) => loginData1(text, "userEmail")}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력하세요"
            value={loginData.userPassword}
            onChangeText={(text) => loginData1(text, "userPassword")}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={login()}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  );
};

export default Login;

const styles = StyleSheet.create({

  login: {
    fontSize: 60,              
    fontWeight: "800",         
    color: "#333",             
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 2,          
  },
  
  safearea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "white",
    marginTop: 100,
  },
  inputWrapper: {
    marginTop: 30,
    marginBottom: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: "#ccc",
  },
  input: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#8ED2B2",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },


});
