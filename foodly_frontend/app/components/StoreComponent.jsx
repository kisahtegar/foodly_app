import React, { useEffect, useState } from "react";
import NetworkImage from "./NetworkImage";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import { RatingInput } from "react-native-stock-star-rating";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoogleApiServices from "../hook/GoogleApiServices";

const StoreComponent = ({ item, onPress }) => {
  const [distanceTime, setDistanceTime] = useState({});

  useEffect(() => {
    calculateDistanceAndTime();
  }, []);

  const calculateDistanceAndTime = async () => {
    const lat = await AsyncStorage.getItem("latitude");
    const long = await AsyncStorage.getItem("longitude");

    GoogleApiServices.calculateDistanceAndTime(
      lat,
      long,
      //restaurant coordinates
      item.coords?.latitude,
      item.coords?.longitude
    ).then((result) => {
      if (result) {
        setDistanceTime(result);
      }
    });
  };

  const extractNumbers = (inputStr) => {
    if (typeof inputStr !== "string") {
      return [];
    }
    const matched = inputStr.match(/\d+/g);
    return matched ? matched.map((num) => parseInt(num, 10)) : [];
  };

  const totalMins =
    extractNumbers("25 minutes")[0] + extractNumbers(distanceTime.duration)[0];

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
        <Text style={styles.small}>{distanceTime.duration}</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RatingInput
            rating={item.rating}
            size={18}
            maxStars={5}
            setRating={item.rating}
            bordered={false}
            color={COLORS.secondary}
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
