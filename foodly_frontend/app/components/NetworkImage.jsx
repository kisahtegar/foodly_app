import React from "react";
import { StyleSheet, Image } from "react-native";

const NetworkImage = ({ source, width, height, radius }) => {
  return (
    <Image
      source={{ uri: source }}
      style={styles.image(width, height, radius)}
    />
  );
};

export default NetworkImage;

const styles = StyleSheet.create({
  image: (width, height, radius) => ({
    height: height,
    width: width,
    borderRadius: radius,
    resizeMode: "cover",
  }),
});
