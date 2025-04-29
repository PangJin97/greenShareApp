import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import CustomText from "../../../components/common/CustomText";
import { colors } from "../../../constants/colorConstant";
import { router, useRouter } from "expo-router";
import envDetail from "./[envId]";
import EnvDetail from "./[envId]";

const Dashboard = ({
  /* 대쉬보드 컴포넌트다 */ autoRefresh = true,
  refreshInterval = 30000,
  customTitle = "환경 센서 요약",
  showStandardInfo = false,
  cropDetail /* 프롭스로 작물의 디테일을 받아옴 */,
  id /* 프롭스로 작물의 아이디를 받아온다 */,
}) => {
  const nav = useNavigation(); /* 컴포넌트 이동을 위한 네비게이션 */
  const router =  useRouter();

  const [latest, setLatest] = useState({
    /* 환경변수를 담아올 변수 */ temperature: 0,
    illuminance: 0,
    humidity: 0,
    soilMoisture: 0,
    joinDate: "",
  });

  const isTempOk = (v) =>
    v >= cropDetail.tempMin &&
    v <= cropDetail.tempMax; /* 현재온도와 작물의 적정 온도를 체크할 함수 */
  const isHumidOk = (v) =>
    v >= cropDetail.humidMin &&
    v <= cropDetail.humidMax; /* 현재습도와 작물의 적정 습도를 체크할 함수 */
  const isSoilOk = (v) =>
    v >= cropDetail.soilMin &&
    v <=
      cropDetail.soilMax; /* 현재토양수분과 작물의 적정 토양수분을 체크할 함수 */
  const isLuxOk = (v) => v >= cropDetail.adcMin && v <= cropDetail.adcMax;
  /* 현재조도와 작물의 적정 조도를 체크할 함수 */

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://10.0.2.2:8080/environment/latest"
      ); /* 가장 최근의 환경데이터 값을 받아올 axios */
      const latestData = res.data;

      setLatest({
        /* 받아온 데이터를 설정해주는 useState */
        temperature: latestData.temperature,
        illuminance: latestData.illuminance,
        humidity: latestData.humidity,
        soilMoisture: latestData.soilMoisture,
        joinDate: new Date(latestData.joinDate).toLocaleTimeString(),
      });
    } catch (err) {
      console.error("데이터 가져오기 실패:", err); /* 실패했을때 catch할 함수 */
    }
  };

  useEffect(() => {
    fetchData(); /* 데이터를 받아오는 함수 */
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (envId) => {
    nav.navigate("[envId]", { cropDetail: JSON.stringify(cropDetail), envId });
  };

  const renderCard = (label, value, unit, isOk, onClick) => (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: isOk(value) ? "#27B06E" : "red" },
      ]}
      onPress={onClick}
    >
      <CustomText style={styles.cardTitle}>{label}</CustomText>
      <CustomText style={styles.statusText}>
        {isOk(value) ? (
          <Text style={styles.green}>● 적정 환경입니다</Text>
        ) : (
          <Text style={styles.red}>● 적정 환경이 아닙니다</Text>
        )}
      </CustomText>
      <CustomText style={styles.cardValue}>
        {value} {unit}
      </CustomText>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>현재 환경 ({latest.joinDate})</Text>
      <TouchableOpacity onPress={() => nav.goBack()}>
        <Text style={styles.backButton}>← 뒤로가기</Text>
      </TouchableOpacity>

      {renderCard("🌡️ 온도", latest.temperature, "°C", isTempOk, () =>
        handleCardClick("temp")
      )}
      {renderCard("💡 조도", latest.illuminance, "ADC", isLuxOk, () =>
        handleCardClick("lux")
      )}
      {renderCard("💧 습도", latest.humidity, "%", isHumidOk, () =>
        handleCardClick("humid")
      )}
      {renderCard("🌱 토양", latest.soilMoisture, "%", isSoilOk, () =>
        handleCardClick("soil")
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  backButton: {
    color: "#007bff",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 4,
    color: "#333",
  },
  statusText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  green: {
    color: colors.MAIN,
  },
  red: {
    color: "red",
  },
});

export default Dashboard;
