import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Header from '@/components/Header'

const TabLayout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.tabArea}>
        <Tabs screenOptions={{headerShown:false}}>
          <Tabs.Screen 
            name='(home)'
            options={{title : '홈11'}}
          />
          <Tabs.Screen 
            name='community'
            options={{title : '커뮤니티'}}
          />
          <Tabs.Screen 
            name='follow'
            options={{title : '팔로우'}}
          />
        <Tabs.Screen 
            name='adminDashboard'
            options={{title : '대쉬보드, 작물리스트'}}
          />
          <Tabs.Screen 
            name='deviceControl'
            options={{title : '(MQTT)기기제어'}}
          />

        </Tabs>
        
        
      </View>
    </SafeAreaView>
  )
}

export default TabLayout

const styles = StyleSheet.create({
  container : {
    flex : 1
  },
  tabArea : {
    flex : 1
  }
})