// DeviceControl.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

// Flask 서버 주소
const RPI_BASE_URL = 'http://192.168.30.235:5000';

// 기기 제어 컴포넌트
export default function DeviceControl({ cropId }) {
  const [sensor, setSensor] = useState(null);

  // cropId가 변경될 때마다 서버에 cropId 전달
  useEffect(() => {
    const updateCropId = async () => {
      try {
        if (cropId) {
          await axios.get(`${RPI_BASE_URL}/sensor`, {
            params: { cropId },
          });
          console.log(`✅ cropId ${cropId} 서버로 전달 완료`);
        }
      } catch (err) {
        console.log('❌ cropId 전달 실패', err.message);
      }
    };
    updateCropId();
  }, [cropId]);

  // 센서 데이터 수동 조회
  const getSensorData = async () => {
    try {
      const res = await axios.get(`${RPI_BASE_URL}/sensor`, {
        params: { cropId },
      });
      setSensor(res.data);
    } catch (err) {
      console.log('센서 데이터 요청 실패', err.message);
    }
  };

  // LED 제어
  const controlLED = async (state) => {
    try {
      await axios.post(`${RPI_BASE_URL}/led`,
        { state, cropId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert(`LED ${state === 'on' ? '켜짐' : '꺼짐'}`);
    } catch (err) {
      console.log('LED 제어 실패', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>센서 수동 제어</Text>

      <Button title="최신 센서 데이터 불러오기" onPress={getSensorData} />

      {/* 센서 데이터 표시 */}
      {sensor && (
        <View style={styles.box}>
          <Text>🌡️ 온도: {sensor.temp} °C</Text>
          <Text>💧 습도: {sensor.humidity} %</Text>
          <Text>💡 조도: {sensor.light}</Text>
          <Text>🌱 토양 수분: {sensor.soil} %</Text>
        </View>
      )}

      {/* LED 제어 버튼 */}
      <View style={styles.btnRow}>
        <Button title="LED 켜기" onPress={() => controlLED('on')} />
        <Button title="LED 끄기" onPress={() => controlLED('off')} />
      </View>
    </View>
  );
}

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  box: {
    marginTop: 20,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
