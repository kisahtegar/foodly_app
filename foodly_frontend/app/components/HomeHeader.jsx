import AssetImage from "./AssetImage";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserReversedGeoCode } from "../context/UserReversedGeoCode";
import { COLORS, SIZES, BaseUrl } from "../constants/theme";
import { UserLocationContext } from "../context/UserLocationContext";
import { CheckUserAddressType } from "../context/CheckUserAddressType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

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
        "[HomeHeader.setDefaultAddres]: Using hard coded lat and lng: LoginPage"
      );
    }
    await AsyncStorage.setItem("latitude", defLat.toString());
    await AsyncStorage.setItem("longitude", defLng.toString());
    console.log(
      "[HomeHeader.setDefaultAddres]: Using hard coded lat and lng: LoginPage ",
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
        "[HomeHeader.getDefault]: Using hard coded lat and lng: HomeHeader"
      );
    } else {
      Toast.show({
        type: "error",
        text1: "User address",
        text2: "No delivery address found as default",
        text1Style: { fontSize: 18, fontWeight: "bold" },
        text2Style: { fontSize: 16, color: "red" },
      });
      console.log("[HomeHeader.getDefault]: defLat defLng =", defLat, defLng);
    }

    // await reverseGeocode(defLat, defLng);

    try {
      const response = await axios.get(`${BaseUrl}/api/address/default`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        if (response.data !== null) {
          setAddress(response.data);
          setCheckUserAddressType(true);
        }
      } else {
        console.log(
          "[HomeHeader.getDefault]: Could not get user address ",
          response.status
        );
      }
    } catch (error) {
      console.error("[HomeHeader.getDefault]: error =", error.message);
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
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={styles.outerStyle}>
        <AssetImage
          data={require("../../assets/images/profile.jpg")}
          width={55}
          height={55}
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
  outerStyle: {
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: "row",
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
    fontSize: SIZES.xxLarge - 5,
    color: COLORS.secondary,
    marginRight: 5,
  },
  location: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});
