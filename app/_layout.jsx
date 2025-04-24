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
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
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
