import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message'; // ✅ Toast 추가

// Flask 서버 주소
const RPI_BASE_URL = 'http://192.168.30.235:5000';

// 기기 제어 컴포넌트
export default function DeviceControl({ cropId }) {
  
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

  // LED 제어 함수
  const controlLED = async (state) => {
    try {
      await axios.post(`${RPI_BASE_URL}/led`,
        { state, cropId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      Toast.show({
        type: 'success',
        text1: `LED ${state === 'on' ? '켜짐' : '꺼짐'}`,
        position : 'top'
      });
    } catch (err) {
      console.log('LED 제어 실패', err.message);
      Toast.show({
        type: 'error',
        text1: 'LED 제어 실패',
        text2: err.message,
        position : 'top',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>기기 제어</Text>

      {/* LED 제어 버튼 */}
      <View style={styles.btnRow}>
        <Button title="LED 켜기" onPress={() => controlLED('on')} />
        <Button title="LED 끄기" onPress={() => controlLED('off')} />
      </View>

      {/* Toast 컴포넌트 등록 */}
      <Toast />
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
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
