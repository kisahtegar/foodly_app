import * as Location from "expo-location";
import AssetImage from "./AssetImage";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserReversedGeoCode } from "../context/UserReversedGeoCode";
import { COLORS, SIZES } from "../constants/theme";
import { UserLocationContext } from "../context/UserLocationContext";
import { LoginContext } from "../context/LoginContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeHeader = () => {
  const [time, setTime] = useState(null);
  const { address, setAddress } = useContext(UserReversedGeoCode);
  const { location, setLocation } = useContext(UserLocationContext);
  const { login, setLogin } = useContext(LoginContext);

  useEffect(() => {
    if (location !== null) {
      reverseGeoCode(location.coords.latitude, location.coords.longitude);
    }
    loginStatus();
  }, [location]);

  const loginStatus = async () => {
    const userToken = await AsyncStorage.getItem("token");

    if (userToken !== null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };

  const reverseGeoCode = async (latitude, longitude) => {
    const reversedGeoCodedAddress = await Location.reverseGeocodeAsync({
      longitude: longitude,
      latitude: latitude,
    });
    setAddress(reversedGeoCodedAddress[0]);
    const greetig = getTimeOfDay();
    setTime(greetig);
  };

  const getTimeOfDay = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 0 && hour < 12) {
      return "🌞 ";
    } else if (hour >= 12 < 17) {
      return "🌤️ ";
    } else {
      return "🌙 ";
    }
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={styles.outerStyle}>
        <AssetImage
          data={require("../../assets/images/profile.jpg")}
          width={50}
          height={50}
          mode={"cover"}
          radius={99}
        />

        <View style={styles.headerStyle}>
          <Text style={styles.heading}>Delivering to</Text>
          <Text
            style={styles.location}
          >{`${address.city} ${address.name}`}</Text>
        </View>
      </View>

      <Text style={{ fontSize: 36 }}>{time}</Text>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  outerStyle: {
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: "row",
  },
  headerStyle: {
    marginLeft: 15,
    justifyContent: "center",
  },
  heading: {
    fontFamily: "medium",
    fontSize: SIZES.small,
    color: COLORS.secondary,
  },
  location: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});
