import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'; // Button → Pressable로 변경
import axios from 'axios';
import Toast from 'react-native-toast-message';

// Flask 서버 주소
const RPI_BASE_URL = 'http://192.168.30.235:5000';

export default function DeviceControl({ cropId }) {
  
  useEffect(() => {
    const updateCropId = async () => {
      try {
        if (cropId) {
          await axios.get(`${RPI_BASE_URL}/sensor`, { params: { cropId } });
          console.log(`✅ cropId ${cropId} 서버로 전달 완료`);
        }
      } catch (err) {
        console.log('❌ cropId 전달 실패', err.message);
      }
    };
    updateCropId();
  }, [cropId]);

  const controlLED = async (state) => {
    try {
      await axios.post(`${RPI_BASE_URL}/led`,
        { state, cropId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      Toast.show({
        type: 'success',
        text1: `LED ${state === 'on' ? '켜짐' : '꺼짐'}`,
        position: 'top'
      });
    } catch (err) {
      console.log('LED 제어 실패', err.message);
      Toast.show({
        type: 'error',
        text1: 'LED 제어 실패',
        text2: err.message,
        position: 'top',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌱 기기 제어</Text>

      <View style={styles.btnRow}>
        <Pressable style={styles.button} onPress={() => controlLED('on')}>
          <Text style={styles.buttonText}>LED 켜기</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => controlLED('off')}>
          <Text style={styles.buttonText}>LED 끄기</Text>
        </Pressable>
      </View>

      <Toast />
    </View>
  );
}

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F9FBF7', // 연한 초록-아이보리 톤 배경
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', // 식물 느낌의 초록색
    textAlign: 'center',
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#81C784', // 연한 초록색 버튼
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12, // 둥글둥글
    elevation: 2, // 살짝 그림자
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
