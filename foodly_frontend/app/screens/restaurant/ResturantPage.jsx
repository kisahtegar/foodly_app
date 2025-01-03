import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import NetworkImage from "../../components/NetworkImage";
import { COLORS, SIZES } from "../../constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RatingInput, Rating } from "react-native-stock-star-rating";
import RestComponent from "../../components/RestComponent";
import { UserLocationContext } from "../../context/UserLocationContext";
import GoogleApiServices from "../../hook/GoogleApiServices";
import { RestaurantContext } from "../../context/RestaurantContext";
import { UserReversedGeoCode } from "../../context/UserReversedGeoCode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../../context/LoginContext";

const ResturantPage = ({ navigation, onPress }) => {
  const [rating, setRating] = useState(0);
  const [distanceTime, setDistanceTime] = useState({});
  const [apiCaller, setApiCaller] = useState(false);
  const { login, setLogin } = useContext(LoginContext);
  const [tokenVal, setTokenVal] = useState(null);

  //inside this we have restaurant coordinates
  const { restaurantObj, setRestaurant } = useContext(RestaurantContext);

  const route = useRoute();
  const restaurant = route.params;

  const getUserdata = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token === null) {
      console.log("[ResturantPage.getUserdata]: You must login.");
      setTokenVal(null);
      return;
    } else {
      setTokenVal(token);
    }

    //  console.log(JSON.parse(userId));
  };

  useEffect(() => {
    calculateDistanceAndTime();
    getUserdata();
  }, [apiCaller]);

  const calculateDistanceAndTime = async () => {
    const lat = await AsyncStorage.getItem("latitude");
    const long = await AsyncStorage.getItem("longitude");
    GoogleApiServices.calculateDistanceAndTime(
      lat,
      long,

      //restaurant coordinates
      restaurantObj.coords?.latitude,
      restaurantObj.coords?.longitude
    ).then((result) => {
      if (result) {
        setDistanceTime(result);
        setApiCaller(true);
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
    <View style={{ backgroundColor: COLORS.lightWhite }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backbtn}
      >
        <Ionicons name="chevron-back-circle" size={30} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("orders-page")}
        style={styles.shareBtn}
      >
        <MaterialCommunityIcons
          name="share-circle"
          size={30}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      <View>
        <NetworkImage
          source={restaurant.imageUrl}
          width={SIZES.width}
          height={SIZES.height / 3.4}
          radius={20}
        />

        <View style={styles.rating}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 12,
            }}
          >
            <RatingInput
              rating={restaurant.rating}
              size={14}
              maxStars={5}
              setRating={5}
              bordered={false}
              color={COLORS.primary}
            />

            <TouchableOpacity
              style={styles.rateBtn}
              onPress={() => {
                if (login == false || login == null) {
                  navigation.navigate("login");
                } else {
                  navigation.navigate("rating-page");
                }
              }}
            >
              <Text style={[styles.small, { marginLeft: 10, color: "white" }]}>
                Rate this shop
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8, marginHorizontal: 8, marginBottom: 10 }}>
        <Text style={styles.title}>{restaurantObj.title}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>Distance</Text>
          <Text style={styles.small}>{distanceTime.distance}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>Cost</Text>

          <Text style={[styles.small, { marginLeft: 10 }]}>
            {distanceTime.finalPrice}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>
            Prep and Delivery Time
          </Text>

          <Text style={[styles.small, { marginLeft: 10 }]}>
            {totalMins} mins
          </Text>
        </View>
      </View>

      <View style={{ height: "100%", marginTop: 15 }}>
        <RestComponent />
      </View>
    </View>
  );
};

export default ResturantPage;

const styles = StyleSheet.create({
  backbtn: {
    marginLeft: 12,
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    top: SIZES.xxLarge,
  },
  shareBtn: {
    marginRight: 12,
    position: "absolute",
    right: 0,
    zIndex: 999,
    top: SIZES.xxLarge,
  },
  wrapper: {
    marginRight: 15,
    backgroundColor: COLORS.lightWhite,
    padding: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "medium",
    marginVertical: 5,
  },
  tile: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.gray,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  textContainer: {
    marginTop: 16,
    width: SIZES.width,
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  small: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  rating: {
    height: 50,
    justifyContent: "center",
    width: "100%",
    // alignItems: "center",
    position: "absolute",
    backgroundColor: "#00fff53c",
    zIndex: 999,
    bottom: 0,
    borderRadius: 18,
  },
  rateBtn: {
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
  },
});
