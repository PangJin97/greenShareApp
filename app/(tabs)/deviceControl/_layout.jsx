import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Buffer } from 'buffer';
import 'react-native-url-polyfill/auto';
import process from 'process';


global.Buffer = global.Buffer || Buffer;
global.process = process;


const DeviceControlLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}/>
  )
}

export default DeviceControlLayout

const styles = StyleSheet.create({})