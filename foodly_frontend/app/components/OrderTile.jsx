import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const OrderTile = ({ onPress, item }) => {
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.outter}>
        <View style={styles.inner}>
          <Ionicons
            name="fast-food-outline"
            size={22}
            color={COLORS.gray}
            style={{ marginTop: 6 }}
          />
          <View>
            <Text style={styles.text}>{item.item.restaurantId.title}</Text>
            <Text style={styles.text}>{item.item._id}</Text>

            <Text style={styles.text}>{item.item.orderItems[0].title}</Text>
          </View>
        </View>
        <Text style={styles.text} numberOfLines={2}>
          {item.item.paymentStatus}
        </Text>

        <Text style={styles.text}>{`$${item.item.orderTotal}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderTile;

const styles = StyleSheet.create({
  outter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginVertical: 5,
  },
  inner: {
    width: "60%",
    flexDirection: "row",
    marginHorizontal: 20,
    alignItems: "flex-start",
  },
  text: {
    marginLeft: 10,
    fontFamily: "regular",
    fontSize: 12,
    color: COLORS.gray,
  },
});
