import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/theme";

const BackBtn = ({ onPress, top }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backbtn(top)}>
      <Ionicons name="chevron-back-circle" size={30} color={COLORS.primary} />
    </TouchableOpacity>
  );
};

export default BackBtn;

const styles = StyleSheet.create({
  backbtn: (top) => ({
    marginHorizontal: SIZES.small,
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    top: top ?? SIZES.large - 10,
  }),
});
