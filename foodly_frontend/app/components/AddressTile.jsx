import { StyleSheet, Text, TouchableOpacity, View, Switch } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const AddressTile = ({ onPress, item }) => {
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  const handleSwitchToggle = () => {
    setIsDefaultAddress(!isDefaultAddress);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.outter}>
        <View style={styles.inner}>
          <FontAwesome
            name="building-o"
            size={22}
            color={COLORS.gray}
            style={{ marginTop: 6 }}
          />
          <View>
            <Text style={styles.text} numberOfLines={2}>
              {item.addressLine1}
            </Text>
            <Text style={styles.text}>{item.postalCode}</Text>
          </View>
        </View>

        <Switch value={item.default} onValueChange={handleSwitchToggle} />
      </View>
    </TouchableOpacity>
  );
};

export default AddressTile;

const styles = StyleSheet.create({
  outter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  inner: {
    width: "70%",
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
