import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRoute } from "@react-navigation/native";
import { axiosInstance } from "./../../../apis/axiosInstance";
import { styles } from "./../../../node_modules/react-native-toast-message/lib/src/components/AnimatedContainer.styles";
import CustomText from "./../../../components/common/CustomText";
import Feather from "@expo/vector-icons/Feather";

const WebSocketClient = () => {
  const route = useRoute();
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [threadId, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] =
    useState(""); /* 메세지 내용부분 */
  const [client, setClient] = useState(null); /* 소켓 클라이언트 설정 */
  const [connected, setConnected] = useState(false); // 연결 상태 추적
  const utcDate = new Date().toISOString(); /* 시간포멧을 설정하기 위한 */
  const date = new Date(utcDate);
  const flatListRef = useRef(null); // FlatList의 ref를 설정

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100); // 100ms 딜레이 후 호출
    }
  }, [messages]); // 메시지가 변경될 때마다 호출

  // 한국 시간 (KST) 기준으로 변환
  const koreaTime = date.toLocaleString("ko-KR", {
    /* 한국 시간을 받아오는 변수 */ timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  /* 한국시간으로 표시해주는 함수*/
  const formatToKoreanTime = (isoTimestamp) => {
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit" /* 시간 */,
      minute: "2-digit" /* 분 */,
      hour12: true /* 12시간으로 오전 오후 나누기*/,
    });
  };

  console.log(sender);
  console.log(receiver);
  // 출력 포맷을 "yyyy-MM-dd HH:mm:ss"처럼 정제
  const formatted = koreaTime.replace(
    /* 시간 정규식 자바에 맞춰줌 */
    /(\d{4})\. (\d{2})\. (\d{2})\. (오전|오후) (\d{1,2}):(\d{2}):(\d{2})/,
    (_, year, month, day, period, hour, minute, second) => {
      let hour24 = parseInt(hour, 10);

      if (period === "오전" && hour24 === 12) {
        hour24 = 0; /* 오전 없앰 12시간 넘으면 */
      } else if (period === "오후" && hour24 !== 12) {
        hour24 += 12; /* 오후 없앰 */
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
      /* 이전 라우트에서 파람스로 변수 받아오는 함수 */
      const { sender, receiver } = route.params; /* 센더와 리시버 두개 받아옴 */
      setSender(sender); /* 샌더 설정 */
      setReceiver(receiver); /* 리시버 설정 */
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
    <View style={loStyles.mainCon}>
      {/* 메세지 목록 */}
      <View style={loStyles.msgCon}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const isSender = item.sender === sender;
            const currentMinute = item.timestamp?.slice(0, 16);
            const nextMinute =
              index < messages.length - 1
                ? messages[index + 1].timestamp?.slice(0, 16)
                : null;

            const isLastInMinute = currentMinute !== nextMinute;
            return (
              <>
                <View
                  style={[
                    loStyles.messageBubble,
                    isSender ? loStyles.myMessage : loStyles.otherMessage,
                  ]}
                >
                  <CustomText
                    weight="SemiBold"
                    style={[
                      /* 스타일 */ loStyles.messageText,
                      isSender
                        ? loStyles.white
                        : loStyles.black /* 센더일시 흰색 */,
                    ]}
                  >
                    {item.content}
                    {/* 내용 */}
                  </CustomText>
                </View>
                {isLastInMinute && (
                  <CustomText
                    weight="Medium"
                    style={[
                      loStyles.timestamp,
                      isSender
                        ? loStyles.timestampRight
                        : loStyles.timestampLeft,
                    ]}
                  >
                    {formatToKoreanTime(item.timestamp)}
                  </CustomText>
                )}
              </>
            );
          }}
          contentContainerStyle={{ paddingBottom: 10 }} // 입력창 안 가리도록
        />
      </View>

      {/* 입력창 */}
      <View style={loStyles.inputContainer}>
        <TextInput
          style={[loStyles.input, { fontFamily: "Pretendard-Medium" }]}
          placeholder="메세지 입력"
          value={messageContent}
          onChangeText={setMessageContent}
        />
        {messageContent ? (
          <Pressable
            style={[loStyles.sendBTN, loStyles.green]}
            color="#27B06E"
            onPress={sendMessage}
          >
            <CustomText weight="Bold" col="white" size={20}>
              ↑
            </CustomText>
          </Pressable>
        ) : (
          <Pressable
            style={[loStyles.sendBTN, loStyles.gray]}
            color="#27B06E"
            onPress={sendMessage}
          >
            <CustomText weight="Bold" size={20}>
              ↑
            </CustomText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default WebSocketClient;

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const loStyles = StyleSheet.create({
  mainCon: {
    /* 메인 컨테이너 */ flex: 1,
    backgroundColor: "#fff" /* 백그라운드 컬러 */,
  },
  msgCon: {
    /* 메세지 컨테이너 */ flex: 1,
    paddingHorizontal: 11 /* 양옆 패딩을 주어 메세지가 띄어지게함 */,
  },
  inputContainer: {
    /* 인풋 및 버튼을 담고 있는 컨테이너 */ flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  input: {
    /* 채팅 입력창 */ flex: 1,
    height: 40 /* 채팅창 높이 */,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    width: "100%",
    borderRadius: 20,
    paddingLeft: 20,
  },
  messageBubble: {
    /* 말풍선 디자인틀 */ maxWidth: "80%",
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "column", // 세로로 배치
    alignItems: "flex-start", // 좌측 정렬
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  myMessage: {
    /* 내가 보낸 말풍선 */ backgroundColor: "#27B06E",
    alignSelf: "flex-end",
  },
  otherMessage: {
    /* 상대방이 보낸 말풍선 */ backgroundColor: "#EAEAEA",
    alignSelf: "flex-start",
  },
  messageText: {
    /* 말풍선 폰트 */ fontSize: 16,
  },
  timestamp: {
    /* 메세지 시간 폰트 설정 */ fontSize: 11,
    color: "gray",
    marginTop: 0, // 메시지와 시간 간격 조정
    textAlign: "right", // 오른쪽 정렬 (필요시 조정)
    marginBottom: 10,
  },
  timestampRight: {
    /* 내가 보낸 메세지일 경우 오른쪽에 배치 */ paddingRight: 5,
    alignSelf: "flex-end", // 보낸 메시지의 시간을 오른쪽 정렬
  },

  timestampLeft: {
    /* 상대가 보낸 메세지일 경우 왼쪽에 배치 */ paddingLeft: 5,
    alignSelf: "flex-start", // 받은 메시지의 시간을 왼쪽 정렬
  },
  white: {
    /* 흰색 */ color: "white",
  },
  black: {
    /* 검은색 */ color: "#374151",
  },
  sendBTN: {
    /* 메세지 전송 버튼 디자인 공용틀 */ width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    position: "absolute",
    right: 15,
  },
  green: {
    backgroundColor: "#27B06E",
  },
  gray: {
    backgroundColor: "#E2E8F0",
  },
});
