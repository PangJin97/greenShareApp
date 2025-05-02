import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  Dimensions,
  Image,
  TextInput,
  FlatList,
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
import {
  getUserSubFromToken,
  getUserRoleFromToken,
} from "../../../redux/authHelper";
import dayjs from "dayjs";

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
  const myEmail = getUserSubFromToken(token);
  const myRole = getUserRoleFromToken(token);

  const isMyPost =
    detailData?.userEmail?.toLowerCase() === myEmail?.toLowerCase() ||
    myRole === "ROLE_ADMIN";

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

  const headerComponent = (
    <View style={styles.card}>
      <Text style={styles.title}>{detailData.title || "제목 없음"}</Text>
      <View style={styles.metaInfo}>
        <Text style={styles.metaText}>작성자: {detailData.userEmail}</Text>
        <Text style={styles.metaText}>등록일: {dayjs(detailData.regDate).format('YYYY-MM-DD')}</Text>
        <Text style={styles.metaText}>조회수: {detailData.readCnt ?? "0"}</Text>
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
            setReplyInfo({ ...replyInfo, content: text, boardNum: Number(boardNum) })
          }
          style={styles.commentInput}
          multiline
        />
        <Pressable style={styles.commentButton} onPress={() => reply(replyInfo)}>
          <Text style={styles.commentButtonText}>댓글 등록</Text>
        </Pressable>
      </View>
    </View>
  );

  const footerComponent = isMyPost && (
    <View style={styles.buttonGroup}>
      <Pressable style={styles.editBtn} onPress={handleEdit}>
        <Text style={styles.btnText}>수정하기</Text>
      </Pressable>
      <Pressable style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.btnText}>삭제하기</Text>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={replies}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      keyExtractor={(item, index) => item.replyNum?.toString() ?? index.toString()}
      renderItem={({ item }) => (
        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUser}>{item.userEmail || "익명"}</Text>
            <Text style={styles.commentDate}>{dayjs(item.regDate).format("YYYY-MM-DD")}</Text>
          </View>
          <Text style={styles.commentContent}>{item.content}</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.commentEmpty}>아직 댓글이 없습니다.</Text>
      }
    />
  );
};

export default DetailScreen;


const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    backgroundColor: '#F1F8F4',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#5E716A",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E473D",
    marginBottom: 10,
    textAlign: "center",
  },
  metaInfo: {
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#DCE8E2",
  },
  metaText: {
    fontSize: 13,
    color: "#677E75",
    textAlign: "center",
  },
  contentArea: {
    marginVertical: 20,
    padding: 12,
    backgroundColor: "#F6FCF8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0E6DA",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#A8D0BA",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#ffffff",
    fontSize: 14,
  },
  commentButton: {
    backgroundColor: "#3DA66E",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  commentButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  commentTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2E6651",
  },
  commentCard: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D5EDE0",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  commentUser: {
    fontWeight: "bold",
    color: "#3A7660",
    fontSize: 13,
  },
  commentDate: {
    fontSize: 12,
    color: "#888888",
  },
  commentContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  commentEmpty: {
    fontSize: 13,
    color: "#999999",
    textAlign: "center",
    marginVertical: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    marginBottom: 36,
  },
  editBtn: {
    width: "45%",
    backgroundColor: "#9CCC65",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteBtn: {
    width: "45%",
    backgroundColor: "#EF5350",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
