import { View } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { SIZES } from "../constants/theme";

const LoadingScreen = () => {
  const animation = useRef(null);
  return (
    <View
      style={{
        height: SIZES.height,
        backgroundColor: "#ffffff",
        justifyContent: "center",
      }}
    >
      <LottieView
        autoPlay
        ref={animation}
        style={{ width: SIZES.width / 2, height: SIZES.height / 2.8 }}
        source={require("../../assets/anime/delivery.json")}
      />
    </View>
  );
};

export default LoadingScreen;
