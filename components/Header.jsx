import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux';
import { getUserSubFromToken } from '../redux/authHelper';
import * as SecureStore from 'expo-secure-store';
import { logoutReducer } from '../redux/authSlice';

const Header = () => {
  const router = useRouter();
  const auth = useSelector(state => state.auth); //{token : null, isLogin : false} 
  

  const dispatch = useDispatch();

  const handleLogout = () => {
    SecureStore.deleteItemAsync('accessToken')
    .then(() => {
      console.log("SecureStore 삭제 완료");
      dispatch(logoutReducer());
      router.replace('/')
    })
    .catch(error => console.error("SecureStore 오류:", error));
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Header</Text>
      <View style={styles.loginStatus}>
        
        {
          auth.isLogin 
          ? 
          <>
            <Text>{getUserSubFromToken(auth.token)} 님 반갑습니다.</Text>
            <Pressable onPress={handleLogout}>
              <Text>Logout</Text>
            </Pressable>
          </>
          :
          <>
            <Pressable onPress={() => router.push('/auth/login')}>
              <Text>Login</Text>
            </Pressable>
            
            <Pressable onPress={() => router.push('/auth/join')}>
              <Text>Join</Text>
            </Pressable>
          </>
        }

      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainer:{
    height:70,
    backgroundColor:'orange'
  },
  headerTitle:{
    fontSize:30,
    color:'white'
  },
  loginStatus :{
    flexDirection : 'row',
    justifyContent : 'flex-end',
    gap: 12,
    paddingRight: 12
  }
})