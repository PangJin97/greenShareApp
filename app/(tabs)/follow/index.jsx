import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { follow, unfollowApi } from '../../../apis/memberApi';
import * as SecureStore from 'expo-secure-store';
import { decode as atob } from 'base-64'; // atob 대체


const SerchHomeScreen  = () => {



  const [followList, setFollowList] = useState([]);

  const getUserEmailFromToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) return null;
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub;
    } catch (error) {
      console.error('토큰 디코딩 오류:', error);
      return null;
    }
  };
  


  const FollowLists = (userEmail) => {
    follow(userEmail) 
      .then((res) => {
        console.log(res.data);
        setFollowList(res.data);
      })
      .catch((error) => {
        console.log('팔로우 API 오류:', error);
      });
  };


  const unfollow = async (toUserEmail) => {
    const fromUserEmail = await getUserEmailFromToken();
    if (!fromUserEmail) return;
  
    try {
      await unfollowApi(toUserEmail, fromUserEmail);
      
      setFollowList((prevList) =>
        prevList.filter((user) => user.toUserEmail !== toUserEmail)
      );
    } catch (err) {
      console.log('언팔로우 오류:', err);
    }
  };
  


  useEffect(() => {
    const fetchFollow = async () => {
      const userEmail = await getUserEmailFromToken();
      if (!userEmail) return;
  
      FollowLists(userEmail); 
    };
  
    fetchFollow();
  }, []);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}> 팔로우 목록</Text>

        {followList.length === 0 

      ? 

        (
          <Text style={styles.empty}>팔로우한 사용자가 없습니다.</Text>
        ) 

      : 

        (
          followList.map((user) => (
        <View key={user.toUserEmail} style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>📧 이메일</Text>
              <Text style={styles.email}>{user.toUserEmail}</Text>
            </View>

            <TouchableOpacity
              style={styles.unfollowBtn}
              onPress={() => unfollow(user.toUserEmail)}
            >
              <Text style={styles.unfollowText}>언팔로우</Text>
            </TouchableOpacity>
        </View>
      </View>

          ))
        )
      }
    </ScrollView>
  );
};

export default SerchHomeScreen ;

const styles = StyleSheet.create({


  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2f3542',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495e',
  },
  empty: {
    color: '#b0b0b0',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
  unfollowBtn: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  unfollowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  
  


});
