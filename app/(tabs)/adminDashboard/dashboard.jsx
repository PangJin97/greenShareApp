// Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import CustomText from "../../../components/common/CustomText";
import { colors } from "../../../constants/colorConstant";
import DeviceControl from "../../../components/DeviceControl"; // ✅ 제어 컴포넌트

// 대시보드 화면
const Dashboard = ({
  autoRefresh = true,            // 자동 새로고침 여부 (기본 true)
  refreshInterval = 30000,       // 새로고침 주기 (30초)
  customTitle = "환경 센서 요약", // 화면 타이틀
  showStandardInfo = false,      // 기준 정보 표시 여부
  cropDetail,                    // 선택된 작물 상세 정보
  id,                             // 선택된 cropId (작물 ID)
}) => {
  // 최신 환경 데이터를 저장
  const [latest, setLatest] = useState({
    temperature: 0,
    illuminance: 0,
    humidity: 0,
    soilMoisture: 0,
    joinDate: "",
  });

  // 작물 기준값과 비교하는 함수
  const isTempOk = (v) => v >= cropDetail.tempMin && v <= cropDetail.tempMax;
  const isHumidOk = (v) => v >= cropDetail.humidMin && v <= cropDetail.humidMax;
  const isSoilOk = (v) => v >= cropDetail.soilMin && v <= cropDetail.soilMax;
  const isLuxOk = (v) => v >= cropDetail.adcMin && v <= cropDetail.adcMax;

  // 서버에서 최신 데이터 가져오기
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
      console.error("데이터 가져오기 실패:", err.message);
    }
  };

  // 첫 진입 시 + 주기적 갱신
  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, []);

  // 카드 클릭시 상세 페이지 이동
  const handleCardClick = (envId) => {
    router.push({
      pathname: "/adminDashboard/[envId]",
      params: {
        cropDetail: JSON.stringify(cropDetail),
        envId,
      },
    });
  };

  // 카드 렌더링
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
      {/* 타이틀 */}
      <Text style={styles.title}>
        {customTitle} ({latest.joinDate})
      </Text>

      {/* 뒤로가기 */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>← 뒤로가기</Text>
      </TouchableOpacity>

      {/* 4개의 환경 카드 */}
      {renderCard("🌡️ 온도", latest.temperature, "°C", isTempOk, () =>
        handleCardClick("temp")
      )}
      {renderCard("💡 조도", latest.illuminance, "ADC", isLuxOk, () =>
        handleCardClick("lux")
      )}
      {renderCard("💧 습도", latest.humidity, "%", isHumidOk, () =>
        handleCardClick("humid")
      )}
      {renderCard("🌱 토양 수분", latest.soilMoisture, "%", isSoilOk, () =>
        handleCardClick("soil")
      )}

      {/* ✅ 라즈베리파이 제어 컴포넌트 */}
      <DeviceControl cropId={id} />
    </ScrollView>
  );
};

// 스타일
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
