//  필요한 라이브러리 불러오기
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

// 라즈베리파이의 Flask 서버 주소 (host: 0.0.0.0, port: 5000)
const RPI_BASE_URL = 'http://192.168.30.235:5000'; // 반드시 라즈베리파이 IP로 설정!

//  이 컴포넌트는 라즈베리파이와 연결해서 센서값 확인 & LED 제어할 수 있음
export default function DeviceControl() {
  //  센서 데이터를 저장할 상태값
  const [sensor, setSensor] = useState(null);

  //  Flask 서버로 센서값 요청 → 응답 받아서 화면에 표시
  const getSensorData = async () => {
    try {
      const res = await axios.get(`${RPI_BASE_URL}/sensor`); // GET 요청
      setSensor(res.data); // 받아온 JSON 데이터를 sensor 상태에 저장
    } catch (err) {
      console.log('센서 데이터 요청 실패', err); // 에러 발생 시 콘솔 출력
    }
  };

  //  LED 제어 요청 (on 또는 off)
  const controlLED = async (state) => {
    try {
      await axios.post(`${RPI_BASE_URL}/led`, { state }); // POST 요청으로 상태 전달
      alert(`LED ${state === 'on' ? '켜짐' : '꺼짐'}`); // 알림창 표시
    } catch (err) {
      console.log('LED 제어 실패', err); // 에러 발생 시 콘솔 출력
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.header}> 라즈베리파이 제어</Text>

      {/* 센서 데이터 요청 버튼 */}
      <Button title="최신 센서 데이터 불러오기" onPress={getSensorData} />

      {/* 최신 데이터 화면에 표시 */}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,         // 화면 전체 채우기
    padding: 20,     // 좌우 여백
    justifyContent: 'center', // 수직 정렬
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
    flexDirection: 'row', // 버튼을 가로로 배치
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
