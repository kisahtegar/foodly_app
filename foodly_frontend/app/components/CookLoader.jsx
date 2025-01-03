import { View } from "react-native";
import React from "react";
import { SIZES } from "../constants/theme";
import AssetImage from "./AssetImage";

const CookLoader = ({ height }) => {
  return (
    <View
      style={{
        height: SIZES.height / 1.7,
        width: SIZES.width,
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <AssetImage
        height={SIZES.height / 2}
        width={SIZES.width}
        data={require("../../assets/anime/shot.gif")}
      />
    </View>
  );
};

export default CookLoader;
