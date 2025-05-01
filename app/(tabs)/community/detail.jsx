import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  Dimensions,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getDetailStories,
  deleteStories,
  insertReply,
  replyList,
} from "../../../apis/plantStory";
import RenderHtml from "react-native-render-html";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getUserSubFromToken } from "../../../redux/authHelper"; // ✅ 수정됨

const DetailScreen = () => {
  const { boardNum } = useLocalSearchParams();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyInfo, setReplyInfo] = useState({});
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [replies, setReplies] = useState([]);

  const token = useSelector((state) => state.auth.token);
  const myEmail = getUserSubFromToken(token); // ✅ sub에서 이메일 추출
  const isMyPost =
    detailData?.userEmail?.toLowerCase() === myEmail?.toLowerCase();

  useFocusEffect(
    useCallback(() => {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const response = await getDetailStories(Number(boardNum));
          setDetailData(response.data);
        } catch (error) {
          console.error("상세 조회 실패:", error);
          Alert.alert("오류", "게시글을 가져오는 데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };

      fetchDetail();
    }, [boardNum, reloadTrigger])
  );

  const reply = async (replyData) => {
    try {
      const res = await insertReply(replyData);
      const newToken = res.headers?.authorization;
      if (newToken) {
        await SecureStore.setItemAsync("accessToken", newToken);
      }
      Alert.alert("성공", "댓글이 등록되었습니다.");
      setReloadTrigger((prev) => !prev);
    } catch (error) {
      console.error("댓글 등록 오류:", error);
      Alert.alert("오류", "댓글 등록에 실패했습니다.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchReplies = async () => {
        try {
          const res = await replyList(Number(boardNum));
          setReplies(res.data);
        } catch (err) {
          console.error("댓글 불러오기 실패:", err);
        }
      };

      if (boardNum) fetchReplies();
    }, [boardNum, reloadTrigger])
  );

  const handleDelete = async () => {
    Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteStories(Number(boardNum));
            Alert.alert("삭제 완료", "게시글이 삭제되었습니다.");
            router.back();
          } catch (error) {
            console.error("삭제 실패:", error);
            Alert.alert("삭제 실패", "게시글 삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    router.push(`/community/edit/${boardNum}`);
  };

  const customRenderers = {
    img: ({ tnode }) => {
      const imageUri = tnode.attributes.src;
      if (!imageUri) return null;
      return (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: screenWidth * 0.9,
            height: 200,
            resizeMode: "contain",
            borderRadius: 10,
            alignSelf: "center",
            marginVertical: 10,
          }}
        />
      );
    },
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </View>
    );
  }

  if (!detailData) {
    return (
      <View style={styles.center}>
        <Text>데이터를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{detailData.title || "제목 없음"}</Text>

        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>
            작성자: {detailData.userEmail || "작성자 없음"}
          </Text>
          <Text style={styles.metaText}>
            등록일: {detailData.regDate || "등록일 없음"}
          </Text>
          <Text style={styles.metaText}>
            조회수: {detailData.readCnt ?? "0"}
          </Text>
        </View>

        <View style={styles.contentArea}>
          {detailData.content ? (
            <RenderHtml
              contentWidth={screenWidth}
              source={{ html: detailData.content }}
              renderers={customRenderers}
            />
          ) : (
            <Text>내용 없음</Text>
          )}
        </View>

        <View style={styles.commentInputContainer}>
          <TextInput
            placeholder="댓글을 입력하세요"
            value={replyInfo.content}
            onChangeText={(text) =>
              setReplyInfo({
                ...replyInfo,
                content: text,
                boardNum: Number(boardNum),
              })
            }
            style={styles.commentInput}
            multiline
          />
          <Pressable
            style={styles.commentButton}
            onPress={() => reply(replyInfo)}
          >
            <Text style={styles.commentButtonText}>등록</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={styles.commentTitle}>댓글</Text>
          {replies.length === 0 ? (
            <Text style={styles.commentEmpty}>아직 댓글이 없습니다.</Text>
          ) : (
            replies.map((reply) => (
              <View key={reply.replyNum} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>
                    {reply.userEmail || "익명"}
                  </Text>
                  <Text style={styles.commentDate}>{reply.regDate}</Text>
                </View>
                <Text style={styles.commentContent}>{reply.content}</Text>
              </View>
            ))
          )}
        </View>

        {isMyPost && (
          <View style={styles.buttonGroup}>
            <Pressable style={styles.editBtn} onPress={handleEdit}>
              <Text style={styles.btnText}>수정</Text>
            </Pressable>
            <Pressable style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.btnText}>삭제</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef6f7",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  metaInfo: {
    marginBottom: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  metaText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
    textAlign: "center",
  },
  contentArea: {
    marginBottom: 30,
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  editBtn: {
    width: "45%",
    backgroundColor: "#90ee90",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteBtn: {
    width: "45%",
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  commentEmpty: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 10,
  },
  commentCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  commentUser: {
    fontWeight: "bold",
    color: "#007bff",
    fontSize: 14,
  },
  commentDate: {
    fontSize: 12,
    color: "#777",
  },
  commentContent: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    minHeight: 45,
    backgroundColor: "#fff",
  },
  commentButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
