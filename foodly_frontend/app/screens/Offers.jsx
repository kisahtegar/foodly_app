import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants/theme";

const Offers = () => {
  return (
    <SafeAreaView>
      <View style={{ backgroundColor: "#0078a6", height: SIZES.height }}>
        <View
          style={{
            backgroundColor: COLORS.offwhite,
            height: SIZES.height - 140,
            borderBottomEndRadius: 30,
            borderBottomStartRadius: 30,
          }}
        ></View>
      </View>
    </SafeAreaView>
  );
};

export default Offers;
