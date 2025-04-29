import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert, Dimensions, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDetailStories, deleteStories } from '../../../apis/plantStory';
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
      {/* 제목 */}
      <Text style={styles.title}>{detailData.title || '제목 없음'}</Text>

      {/* 작성자, 등록일, 조회수 */}
      <View style={styles.metaInfo}>
        <Text style={styles.metaText}>작성자: {detailData.userEmail || '작성자 없음'}</Text>
        <Text style={styles.metaText}>등록일: {detailData.regDate || '등록일 없음'}</Text>
        <Text style={styles.metaText}>조회수: {detailData.readCnt ?? '0'}</Text>
      </View>

      {/* 본문 내용 */}
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

      {/* 수정/삭제 버튼 */}
      <View style={styles.buttonGroup}>
        <Pressable style={styles.editBtn} onPress={handleEdit}>
          <Text style={styles.btnText}>수정</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.btnText}>삭제</Text>
        </Pressable>
      </View>
      
    </ScrollView>
  );
};

export default DetailScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  metaInfo: {
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  contentArea: {
    marginBottom: 30,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12, // (React Native 0.71 이상) 버튼 간격
  },
  
  editBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Android 전용 그림자
  },
  
  deleteBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  


});

