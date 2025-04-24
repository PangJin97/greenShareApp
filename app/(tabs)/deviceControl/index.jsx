import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as mqtt from 'mqtt/dist/mqtt'; // ✅ 꼭 이렇게!

export default function DeviceControlScreen() {
  const clientRef = useRef(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const client = mqtt.connect('ws://192.168.30.235:9010/mqtt');
    clientRef.current = client;

    client.on('connect', () => {
      console.log('✅ 연결 성공');
      client.subscribe('test/topic');
      client.publish('test/topic', 'Hello MQTT from Expo!');
    });

    client.on('error', (err) => {
      console.log('❌ MQTT 연결 실패:', err.message);
    });
    

    client.on('message', (topic, message) => {
      setMsg(message.toString());
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>📡 받은 메시지: {msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
