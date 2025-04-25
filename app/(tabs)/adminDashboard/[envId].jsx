import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

const EnvDetail = () => {
  const { envId, cropDetail } = useLocalSearchParams();
  const route = useRoute();
  const crop = JSON.parse(cropDetail);

  alert(crop.crop);
  useEffect(() => {
    axios
      .get(`http://10.0.2.2:8080/environment/${envId}`)
      .then((res) => {
        setCrop(res.data);
        console.log("✅ 서버 응답:" + res.data);
      })
      .catch((err) => {
        console.error("❌ API 호출 실패:", err.message);
      });
  }, []);

  return (
    <View>
      <Text>{envId}</Text>
    </View>
  );
};

export default EnvDetail;

const styles = StyleSheet.create({});
