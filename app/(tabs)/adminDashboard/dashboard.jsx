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
import { router } from "expo-router";

const Dashboard = ({
  autoRefresh = true,
  refreshInterval = 5000,
  customTitle = "환경 센서 요약",
  showStandardInfo = false,
  cropDetail,
  id,
}) => {
  const nav = useNavigation();

  const [latest, setLatest] = useState({
    temperature: 0,
    illuminance: 0,
    humidity: 0,
    soilMoisture: 0,
    joinDate: "",
  });

  const navigation = useNavigation();

  const isTempOk = (v) => v >= cropDetail.tempMin && v <= cropDetail.tempMax;
  const isHumidOk = (v) => v >= cropDetail.humidMin && v <= cropDetail.humidMax;
  const isSoilOk = (v) => v >= cropDetail.soilMin && v <= cropDetail.soilMax;
  const isLuxOk = (v) => v >= cropDetail.adcMin && v <= cropDetail.adcMax;

  const fetchData = async () => {
    try {
      const res = await axios.get("http://10.0.2.2:8080/environment/latest");
      const latestData = res.data;

      setLatest({
        temperature: latestData.temperature,
        illuminance: latestData.illuminance,
        humidity: latestData.humidity,
        soilMoisture: latestData.soilMoisture,
        joinDate: new Date(latestData.joinDate).toLocaleTimeString(),
      });
    } catch (err) {
      console.error("데이터 가져오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (type) => {
    navigation.navigate("DetailScreen", { id, type });
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
        handleCardClick("temperature")
      )}
      {renderCard("💡 조도", latest.illuminance, "ADC", isLuxOk, () =>
        handleCardClick("illuminance")
      )}
      {renderCard("💧 습도", latest.humidity, "%", isHumidOk, () =>
        handleCardClick("humidity")
      )}
      {renderCard("🌱 토양", latest.soilMoisture, "%", isSoilOk, () =>
        handleCardClick("soilMoisture")
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
