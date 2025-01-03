import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useContext } from "react";
import { COLORS } from "../../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BaseUrl } from "../../constants/theme";
import { CheckUserAddressType } from "../../context/CheckUserAddressType";
import { UserReversedGeoCode } from "../../context/UserReversedGeoCode";
import { CheckLoadRestaurantData } from "../../context/CheckRestaurantData";

const bkImg =
  "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734400159/images/randoms/ads-on-internet.png";

const DefaultAddress = ({ route, navigation }) => {
  const item = route.params;
  const { checkUserAddressType, setCheckUserAddressType } =
    useContext(CheckUserAddressType);
  const { address, setAddress } = useContext(UserReversedGeoCode);

  const { loadRestaurantData, setLoadRestaurantData } = useContext(
    CheckLoadRestaurantData
  );

  const handleSubmit = async (id) => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    const url = `${BaseUrl}/api/address/default/${id}`;
    try {
      const response = await axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        await AsyncStorage.setItem(
          "latitude",
          JSON.stringify(response.data.latitude)
        );
        await AsyncStorage.setItem(
          "longitude",
          JSON.stringify(response.data.longitude)
        );
        setAddress(response.data);
        setCheckUserAddressType(true);
        setLoadRestaurantData(true);
        //navigation.goBack();
        navigation.navigate("bottom-navigation");
      } else {
        console.log("[DefaultAddresses.handleSubmit]: response = ", response);
      }
    } catch (error) {
      console.error("[DefaultAddresses.handleSubmit]:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image
        source={{ uri: bkImg }}
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: 0.7,
          },
        ]}
      /> */}
      <View style={styles.outter}>
        <View>
          {
            <Text style={styles.heading} numberOfLines={2}>
              Set this address as default
            </Text>
          }

          <Text style={styles.text} numberOfLines={2}>
            {item.item.addressLine1}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSubmit(item.item._id);
          }}
        >
          <Text style={styles.buttonText}>D E F A U L T</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DefaultAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  outter: {
    marginHorizontal: 12,
    marginTop: 20,
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  inner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  text: {
    marginLeft: 10,
    fontFamily: "regular",
    fontSize: 12,
    color: COLORS.gray,
  },
  buttonText: {
    color: "white",
    fontSize: 16,

    fontFamily: "medium",
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 15,
    height: 40,
    width: "100%",
    alignItems: "center",
  },
  heading: {
    marginLeft: 10,
    fontFamily: "medium",
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 10,
  },
});
