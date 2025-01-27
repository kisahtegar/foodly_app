import AssetImage from "./AssetImage";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserReversedGeoCode } from "../context/UserReversedGeoCode";
import { COLORS, SIZES } from "../constants/theme";
import { UserLocationContext } from "../context/UserLocationContext";
import { CheckUserAddressType } from "../context/CheckUserAddressType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { BASE_URL } from "@env";

const HomeHeader = () => {
  const [time, setTime] = useState(null);
  const { address, setAddress } = useContext(UserReversedGeoCode);
  const { location, setLocation } = useContext(UserLocationContext);
  const [logged, setLogged] = useState(false);
  const { checkUserAddressType, setCheckUserAddressType } =
    useContext(CheckUserAddressType);

  useEffect(() => {
    const greeting = getTimeOfDay();
    setTime(greeting);
    loginStatus();
  }, [location]);

  const loginStatus = async () => {
    const userToken = await AsyncStorage.getItem("token");

    if (userToken !== null) {
      setLogged(true);
      getDefault();
    } else {
      setDefaultAddres();
      setLogged(false);
    }
  };

  const setDefaultAddres = async () => {
    let defLat = await AsyncStorage.getItem("defaultLat");
    let defLng = await AsyncStorage.getItem("defaultLng");
    if (defLat === null || defLng === null) {
      defLat = 37.4219983;
      defLng = -122.084;
      console.log(
        "[HomeHeader.setDefaultAddres]: Using hard coded default lat and lng"
      );
    }
    await AsyncStorage.setItem("latitude", defLat.toString());
    await AsyncStorage.setItem("longitude", defLng.toString());
    console.log(
      "[HomeHeader.setDefaultAddres]: Using hard coded lat and lng =",
      defLat,
      defLng
    );
    //const reverseGeocode1=  await reverseGeocode(defLat, defLng);
  };

  const getDefault = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);

    let defLat = await AsyncStorage.getItem("latitude");
    let defLng = await AsyncStorage.getItem("longitude");

    if (defLat === null || defLng === null) {
      defLat = JSON.parse(37.4219983);
      defLng = JSON.parse(-122.084);
      console.log(
        "[HomeHeader.jsx:getDefault]: Using hard coded lat and lng =",
        defLat,
        defLng
      );
    }

    console.log(
      `[HomeHeader.jsx:getDefault]: defLat & defLng =`,
      defLat,
      defLng
    );

    try {
      const response = await axios.get(`${BASE_URL}/api/address/default`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        if (response.data !== null) {
          const { latitude, longitude } = response.data;
          await AsyncStorage.setItem("defaultLat", JSON.stringify(latitude));
          await AsyncStorage.setItem("defaultLng", JSON.stringify(longitude));
          await AsyncStorage.setItem("latitude", JSON.stringify(latitude));
          await AsyncStorage.setItem("longitude", JSON.stringify(longitude));
          setAddress(response.data);
          setCheckUserAddressType(true);
        }
      } else if (response.status === 404) {
        Toast.show({
          text1: "Alamat Pengguna",
          text2: "Tidak ada default alamat pengiriman.",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 16, color: "red" },
        });
      } else {
        console.log(
          "[HomeHeader.getDefault]: Could not get user address ",
          response.status
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Toast.show({
          text1: "Alamat Pengguna",
          text2: "Tidak ada default alamat pengiriman.",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 16, color: "red" },
        });
      } else {
        console.error("[HomeHeader.getDefault]: error =", error.message);
      }
    }
  };

  const getTimeOfDay = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 0 && hour < 12) {
      return "☀️ ";
    } else if (hour >= 12 && hour < 17) {
      return "🌤️ ";
    } else {
      return "🌙 ";
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.outerStyle}>
        <AssetImage
          data={require("../../assets/images/profile.jpg")}
          width={40}
          height={40}
          mode={"cover"}
          radius={99}
        />

        <View style={styles.headerText}>
          <Text style={styles.heading}>Delivering to</Text>
          {checkUserAddressType === false ? (
            <Text style={styles.location}>
              {`${address.city || "Default City"} ${
                address.street || "Default Street"
              } `}
            </Text>
          ) : (
            <Text numberOfLines={2} style={styles.location}>
              {`${address.addressLine1 || "Default Address Line"} `}
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10, // Add padding to the right to ensure the time icon is not cut off
  },
  outerStyle: {
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 15,
    width: "70%",
    justifyContent: "center",
  },
  heading: {
    fontFamily: "medium",
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
  time: {
    fontFamily: "medium",
    fontSize: SIZES.xxLarge - 7,
    color: COLORS.secondary,
    marginRight: 10, // Add margin to the right to ensure the time icon is not cut off
  },
  location: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});
