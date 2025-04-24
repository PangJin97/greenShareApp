import { useFonts } from "expo-font";
import { Stack, Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Thin": require("./../assets/fonts/Pretendard-Thin.ttf"),
    "Pretendard-ExtraLight": require("./../assets/fonts/Pretendard-ExtraLight.ttf"),
    "Pretendard-Light": require("./../assets/fonts/Pretendard-Light.ttf"),
    "Pretendard-Regular": require("./../assets/fonts/Pretendard-Regular.ttf"),
    "Pretendard-Medium": require("./../assets/fonts/Pretendard-Medium.ttf"),
    "Pretendard-SemiBold": require("./../assets/fonts/Pretendard-SemiBold.ttf"),
    "Pretendard-Bold": require("./../assets/fonts/Pretendard-Bold.ttf"),
    "Pretendard-ExtraBold": require("./../assets/fonts/Pretendard-ExtraBold.ttf"),
    "Pretendard-Black": require("./../assets/fonts/Pretendard-Black.ttf"),
  });
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!loaded) {
    return null;
  }
  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {/* translucent : 투명도 및 범위 설정하는 속성 */}
      {/* true : 반투명 + statusBar 범위 침범 */}
      {/* false : 불투명 + statusBar 범위 침범 안함 */}
      <StatusBar style="dark" translucent={false} backgroundColor="white" />
    </>
  );
}
