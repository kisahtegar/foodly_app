import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import RestaurantPage from "../../navigation/RestaurantPage";
import NetworkImage from "../../components/NetworkImage";
import { COLORS, SIZES } from "../../constants/theme";
import { useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RatingInput } from "react-native-stock-star-rating";
import GoogleApiServices from "../../hook/GoogleApiServices";
import { UserLocationContext } from "../../context/UserLocationContext";

const Restaurant = ({ navigation }) => {
  const route = useRoute();
  const [distanceTime, setDistanceTime] = useState({});
  const { location, setLocation } = useContext(UserLocationContext);
  const item = route.params;

  useEffect(() => {
    GoogleApiServices.calculateDistanceAndTime(
      item.coords.latitude,
      item.coords.longitude,
      location.coords.latitude,
      location.coords.longitude
    ).then((result) => {
      if (result) {
        setDistanceTime(result);
      }
    });
    console.log(distanceTime);
  }, []);

  const totalTime =
    GoogleApiServices.extractNumbers(distanceTime.duration)[0] +
    GoogleApiServices.extractNumbers(item.time)[0];

  return (
    <View>
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backbtn}
        >
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.sharebtn}>
          <MaterialCommunityIcons
            name="share-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <NetworkImage
          data={item.imageUrl}
          height={SIZES.height / 3.4}
          width={SIZES.width}
          raduis={15}
        />
        <View style={styles.rating}>
          <View style={styles.innaRating}>
            <RatingInput rating={Number(item.rating)} size={22} />

            <TouchableOpacity
              style={styles.ratingBtn}
              onPress={() => navigation.navigate("rating")}
            >
              <Text style={styles.btnText}>Rate the Store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8, marginHorizontal: 8, marginBottom: 10 }}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { color: COLORS.gray }]}>Distance</Text>
          <Text style={[styles.small, { fontFamily: "regular" }]}>
            {distanceTime.distance}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { color: COLORS.gray }]}>
            Prep and Delivery Time
          </Text>
          <Text style={[styles.small, { fontFamily: "regular" }]}>
            {totalTime} min
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { color: COLORS.gray }]}>Cost</Text>
          <Text style={[styles.small, { fontFamily: "regular" }]}>
            {distanceTime.finalPrice}
          </Text>
        </View>
      </View>
      <View style={{ height: SIZES.height / 1.5 }}>
        <RestaurantPage />
      </View>
    </View>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  backbtn: {
    marginLeft: 12,
    alignItems: "center",
    zIndex: 999,
    position: "absolute",
    top: SIZES.xxLarge,
  },
  title: {
    fontSize: 22,
    fontFamily: "medium",
    color: COLORS.black,
  },
  small: {
    fontSize: 13,
    fontFamily: "medium",
    color: COLORS.black,
  },
  btnText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.lightWhite,
  },
  sharebtn: {
    marginRight: 12,
    alignItems: "center",
    zIndex: 999,
    right: 0,
    position: "absolute",
    top: SIZES.xxLarge + 3,
  },
  rating: {
    height: 50,
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    backgroundColor: "#00fff53c",
    zIndex: 999,
    bottom: 0,
    borderRadius: 15,
  },
  innaRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
  },
  ratingBtn: {
    borderColor: COLORS.lightWhite,
    borderWidth: 1,
    borderRadius: 9,
    padding: 6,
  },
});
