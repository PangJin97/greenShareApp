// app/community/FarmerCommunityInsert.tsx

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { axiosInstance } from "../../../apis/axiosInstance"; // 본인 API에 맞춰 경로 조정

const FarmerCommunityInsert = () => {
  const router = useRouter();
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const imageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // if (!result.canceled && result.assets?.[0]?.uri) {
    //   const imageUri = result.assets[0].uri;

    //   const manipulated = await ImageManipulator.manipulate(
    //     imageUri,
    //     [{ resize: { width: 1024 } }],
    //     {
    //       compress: 0.8,
    //       format: ImageManipulator.SaveFormat.JPEG,
    //       base64: true,
    //     }
    //   );

    //   const base64Image = `data:image/jpeg;base64,${manipulated.base64}`;
    //   editorRef.current?.insertHTML(`<img src="${base64Image}" />`);
    // }
  };

  const sendInsert = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("알림", "제목과 내용을 모두 입력해 주세요.");
      return;
    }

    axiosInstance
      .post("/plantStories", { title, content })
      .then(() => {
        Alert.alert("성공", "게시글이 등록되었습니다!");
        router.push("/community");
      })
      .catch((error) => {
        console.error("등록 오류:", error);
        Alert.alert("에러", "등록 중 오류가 발생했습니다.");
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>이야기를 올려주세요!</Text>

      <View style={styles.titleBox}>
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          placeholder="제목을 입력하세요"
          value={title}
          onChangeText={setTitle}
        />
      </View>
 
      {/* <RichEditor
        ref={editorRef}
        initialContentHTML=""
        placeholder="내용을 입력하세요"
        style={styles.editor}
        onChange={(html) => setContent(html)}
      />  */}



       <RichToolbar
        editor={editorRef}
        actions={[
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
        ]}
        insertImage={imageHandler}
      /> 

      <View style={styles.btnContainer}>
        <Button title="목록 가기" onPress={() => router.push("/community")} />
        <Button title="작성 완료" onPress={sendInsert} />
      </View>
    </ScrollView>
  );
};

export default FarmerCommunityInsert;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  titleBox: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  editor: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    minHeight: 400,
  },
  btnContainer: {
    marginTop: 20,
    gap: 16,
  },
});
