import React from "react";
import NetworkImage from "./NetworkImage";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import { RatingInput } from "react-native-stock-star-rating";

const StoreComponent = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <NetworkImage
        source={item.imageUrl}
        width={SIZES.width - 80}
        height={SIZES.height / 5.8}
        radius={16}
      />

      <Text style={styles.title}>{item.title}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.small}>Delivery under</Text>
        <Text style={styles.small}>{item.time}</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RatingInput
            rating={item.rating}
            size={14}
            maxStars={5}
            setRating={item.rating}
            bordered={false}
            color={COLORS.primary}
          />

          <Text style={[styles.small, { marginLeft: 10 }]}>
            {item.ratingCount}+ ratings
          </Text>
        </View>

        <Text style={styles.small}>delivery</Text>
      </View>
    </TouchableOpacity>
  );
};

export default StoreComponent;

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 15,
    backgroundColor: COLORS.lightWhite,
    padding: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 14,
    fontFamily: "medium",
    marginTop: 5,
  },
  small: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
  },
});
