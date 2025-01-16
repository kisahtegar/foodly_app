import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

export const useFontsInitialization = () => {
  const [fontsLoaded] = useFonts({
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
    light: require("../../assets/fonts/Poppins-Light.ttf"),
    bold: require("../../assets/fonts/Poppins-Bold.ttf"),
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("../../assets/fonts/Poppins-ExtraBold.ttf"),
    semibold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return { fontsLoaded, onLayoutRootView };
};
