import React from "react";
import { StyleSheet, Image } from "react-native";

const NetworkImage = ({ data, width, height, mode, radius }) => {
  return (
    <Image
      source={{ uri: data }}
      style={styles.image(width, height, mode, radius)}
    />
  );
};

export default NetworkImage;

const styles = StyleSheet.create({
  image: (width, height, mode, radius) => ({
    height: height,
    width: width,
    borderRadius: radius,
    resizeMode: mode,
  }),
});
