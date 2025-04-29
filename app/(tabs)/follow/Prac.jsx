import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";

const Prac = () => {
  const route = useRoute();
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    if (route.params) {
      const { sender, receiver } = route.params; // params에서 값 추출
      setSender(sender);
      setReceiver(receiver);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text>{sender}</Text>
      <Text>{receiver}</Text>
    </View>
  );
};

export default Prac;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
