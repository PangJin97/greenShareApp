import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert, Dimensions, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDetailStories, deleteStories, insertReply } from '../../../apis/plantStory';
import RenderHtml from 'react-native-render-html';

const DetailScreen = () => {
  const { boardNum } = useLocalSearchParams();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;

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
            resizeMode: 'contain',
            borderRadius: 10,
            alignSelf: 'center',
            marginVertical: 10,
          }}
        />
      );
    },
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await getDetailStories(Number(boardNum));
        setDetailData(response.data);
      } catch (error) {
        console.error('상세 조회 실패:', error);
        Alert.alert('오류', '게시글을 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [boardNum]);

const reply = ()=>{
  insertReply()
  .then(()=>{})
  .catch(()=>{})
}





  const handleDelete = async () => {
    Alert.alert(
      '삭제 확인',
      '정말 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStories(Number(boardNum));
              Alert.alert('삭제 완료', '게시글이 삭제되었습니다.');
              router.back();
            } catch (error) {
              console.error('삭제 실패:', error);
              Alert.alert('삭제 실패', '게시글 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    router.push(`/community/edit/${boardNum}`);
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
        <Text style={styles.title}>{detailData.title || '제목 없음'}</Text>

        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>작성자: {detailData.userEmail || '작성자 없음'}</Text>
          <Text style={styles.metaText}>등록일: {detailData.regDate || '등록일 없음'}</Text>
          <Text style={styles.metaText}>조회수: {detailData.readCnt ?? '0'}</Text>
        </View>

        <View style={styles.contentArea}>
          {detailData.content ? (

            <RenderHtml
              contentWidth={screenWidth}
              source={{ html: detailData.content }}
              renderers={customRenderers}
            />
            
          ) : (
            <Text>내용 없음11</Text>
          )}
        </View>


          <View>
            <Text></Text>
            <Text></Text>
          </View>





        <View style={styles.buttonGroup}>
          <Pressable style={styles.editBtn} onPress={handleEdit}>
            <Text style={styles.btnText}>수정</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.btnText}>삭제</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6f7', // 살짝 밝은 배경
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  metaInfo: {
    marginBottom: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  metaText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
    textAlign: 'center',
  },
  contentArea: {
    marginBottom: 30,
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  editBtn: {
    width: '45%',
    backgroundColor: '#90ee90',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteBtn: {
    width: '45%',
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
