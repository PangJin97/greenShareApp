import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getUserSubFromToken } from "../redux/authHelper";
import { useSelector } from "react-redux";

const WebSocketClient = ({ route }) => {
  const { sender, receiver } = route.params;
  const [messages, setMessages] = useState([]); /* 메세지 */
  const [messageContent, setMessageContent] = useState(""); /* 보낼 메세지 */
  const [client, setClient] = useState(null); /* 웹소켓 클라이언트 설정 */


  useEffect(() => {
    if (!sender || !receiver) {
      /* 센더는 토큰에서 가져오고 receiver는 클릭한 값으로 가져온다 */
      return;
    }
    fetch(`http://10.0.2.2:8080/messages?user1=${sender}&user2=${receiver}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error(err));
  }, [sender, receiver]);

  // 웹소켓 클라이언트 설정
  useEffect(() => {
    const stompClient = new Client({
      /* stompClient 설정 */
      brokerURL: "http://10.0.2.2:8080/ws", // 서버의 WebSocket 엔드포인트
      connectHeaders: {},
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe("/topic/messages", (messageOutput) => {
          // 메시지를 받으면 상태 업데이트
          const message = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      },
      onStompError: (frame) => {
        console.error("Error connecting to WebSocket:", frame);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    // 컴포넌트가 unmount될 때 클라이언트 연결 해제
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (client && messageContent) {
      const message = {
        sender: sender,
        receiver: "user2",
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      client.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(message),
      });
      setMessageContent("");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>
              {item.sender}: {item.content}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>
              {item.timestamp}
            </Text>
          </View>
        )}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginVertical: 10,
        }}
        placeholder="Enter message"
        value={messageContent}
        onChangeText={setMessageContent}
      />
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
};

export default WebSocketClient;
