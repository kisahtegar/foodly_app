import React from "react";
import { StyleSheet, Image } from "react-native";

const AssetImage = ({ data, width, height, mode, radius }) => {
  return (
    <Image source={data} style={styles.image(width, height, mode, radius)} />
  );
};

export default AssetImage;

const styles = StyleSheet.create({
  image: (width, height, mode, radius) => ({
    height: height,
    width: width,
    borderRadius: radius,
    resizeMode: mode,
  }),
});
