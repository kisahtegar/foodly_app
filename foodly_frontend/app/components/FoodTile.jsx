import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";
import { AntDesign } from "@expo/vector-icons";
import NetworkImage from "./NetworkImage";

const FoodTile = ({ item, onPress, showDetails }) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.suspendedBtn} onPress={onPress}>
        <AntDesign name="pluscircle" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={showDetails}>
        <NetworkImage
          source={item.imageUrl[0]}
          width={180}
          height={100}
          radius={12}
        />
      </TouchableOpacity>

      <View>
        <Text style={styles.price}>US$ {item.price}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );
};

export default FoodTile;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.secondary1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    marginRight: 10,
    paddingRight: 7,
  },
  suspendedBtn: {
    position: "absolute",
    zIndex: 999,
    bottom: 35,
    right: 14,
    borderRadius: 99,
    padding: 5,
    backgroundColor: COLORS.secondary1,
  },
  price: {
    fontSize: 13,
    fontFamily: "medium",
    paddingHorizontal: 3,
    paddingTop: 5,
  },
  title: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
    paddingHorizontal: 3,
  },
});
