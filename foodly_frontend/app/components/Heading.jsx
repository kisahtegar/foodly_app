import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const Heading = ({ heading, onPress }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 15,
        marginBottom: 7,
        justifyContent: "space-between",
        marginRight: 16,
      }}
    >
      <Text
        style={{
          marginLeft: 16,
          fontSize: 18,
          fontFamily: "bold",
        }}
      >
        {heading}
      </Text>
      <Pressable onPress={onPress}>
        <Ionicons name="grid" size={20} color={COLORS.secondary} />
      </Pressable>
    </View>
  );
};

export default Heading;
