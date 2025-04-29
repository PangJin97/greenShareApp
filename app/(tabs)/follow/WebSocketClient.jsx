import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRoute } from "@react-navigation/native";
import { axiosInstance } from "./../../../apis/axiosInstance";

const WebSocketClient = () => {
  const route = useRoute();
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [threadId, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false); // 연결 상태 추적
  const utcDate = new Date().toISOString(); /* 시간포멧을 설정하기 위한 */
  const date = new Date(utcDate);

  // 한국 시간 (KST) 기준으로 변환
  const koreaTime = date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 출력 포맷을 "yyyy-MM-dd HH:mm:ss"처럼 정제
  const formatted = koreaTime.replace(
    /(\d{4})\. (\d{2})\. (\d{2})\. (오전|오후) (\d{1,2}):(\d{2}):(\d{2})/,
    (_, year, month, day, period, hour, minute, second) => {
      let hour24 = parseInt(hour, 10);

      if (period === "오전" && hour24 === 12) {
        hour24 = 0;
      } else if (period === "오후" && hour24 !== 12) {
        hour24 += 12;
      }

      return `${year}-${month}-${day} ${String(hour24).padStart(
        2,
        "0"
      )}:${minute}:${second}`;
    }
  );

  console.log(formatted);

  useEffect(() => {
    if (route.params) {
      const { sender, receiver } = route.params;
      setSender(sender);
      setReceiver(receiver);
    }
  }, [route.params]);

  useEffect(() => {
    if (!sender || !receiver) return;

    axiosInstance
      .get("/messages/messages", {
        params: { sender, receiver },
      })
      .then((res) => setMessages(res.data))
      .catch((e) => console.log(e));
  }, [sender, receiver]);

  useEffect(() => {
    if (!sender || !receiver) return;

    axiosInstance
      .get("/messages/threadFind", {
        params: { sender, receiver },
      })
      .then((res) => setThread(res.data))
      .catch((e) => console.log(e));
  }, [sender, receiver]);

  // 웹소켓 클라이언트 설정
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://10.0.2.2:8080/ws"),
      connectHeaders: {},
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");
        setConnected(true);
        stompClient.subscribe("/topic/messages", (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (client && connected && messageContent && sender && receiver) {
      const message = {
        threadId,
        sender,
        receiver,
        content: messageContent,
        timestamp: formatted,
      };
      client.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(message),
      });
      setMessageContent("");
    } else {
      console.warn("STOMP 연결 전 메시지를 전송할 수 없습니다.");
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
