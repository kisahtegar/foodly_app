import ReusableHeader from "../components/ReusableHeader";
import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { RatingInput, Rating } from "react-native-stock-star-rating";
import AssetImage from "../components/AssetImage";
import { COLORS, SIZES } from "../constants/theme";
import { RestaurantContext } from "../context/RestaurantContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../context/LoginContext";
import fetchRating from "../hook/fetchRating";
import LoadingScreen from "../components/LoadingScreen";
import { BASE_URL } from "@env";

const AddRating = () => {
  const [rating, setRating] = useState(0);
  const { restaurantObj, setRestaurant } = useContext(RestaurantContext);
  const { login, setLogin } = useContext(LoginContext);
  const { data, loading, error, refetch } = fetchRating();
  let ratingObject;

  if (loading) {
    return <LoadingScreen />;
  }

  const getUserdata = async () => {
    if (login) {
      let id = await AsyncStorage.getItem("id");
      id = JSON.parse(id);
      ratingObject = {
        userId: id,
        restaurantId: restaurantObj._id,
        rating: rating,
      };
      console.log("[AddRating.getUserdata]: my rating =", ratingObject);
    } else {
      console.log("[AddRating.getUserdata]: You haven't logged in");
    }
  };

  const postRating = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token === null) {
      console.log("[AddRating.postRating]: You must login ");
    }
    const accessToken = JSON.parse(token);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/rating`,
        ratingObject,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("[AddRating.postRating]: rating created successfully");
      } else if (response.status === 200) {
        console.log("[AddRating.postRating]: rating updated successfully");
      } else {
        console.log(
          "[AddRating.postRating]: returned status code is ",
          response.status
        );
      }
    } catch (error) {
      console.error(
        "[AddRating.postRating]: There was a problem with the axios request:",
        error
      );
    }
  };

  return (
    <SafeAreaView style={{ height: SIZES.height }}>
      <Image
        source={{
          uri: restaurantObj.imageUrl,
        }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={30}
      />
      <ReusableHeader title={"Add Ratings"} backbtn={true} />

      <View style={styles.container}>
        <View style={styles.ratingBox}>
          <View style={styles.image}>
            <AssetImage
              data={require("../../assets/images/profile.jpg")}
              mode={"cover"}
              width={70}
              height={70}
              radius={99}
            />
          </View>

          <View style={{ paddingTop: 40 }}>
            {data.status !== true ? (
              <RatingInput
                rating={rating}
                color={COLORS.primary}
                setRating={setRating}
                size={50}
                maxStars={5}
                bordered={false}
              />
            ) : (
              <RatingInput
                rating={data.rating}
                color={COLORS.primary}
                setRating={5}
                size={50}
                maxStars={5}
                bordered={false}
              />
            )}

            <Text
              style={[
                styles.small,
                { paddingLeft: 80, marginTop: 10, color: COLORS.black },
              ]}
            >
              TAP TO RATE
            </Text>
          </View>
        </View>

        <View style={{ height: 50 }} />
        {data.status === true ? (
          <View />
        ) : (
          <TouchableOpacity
            style={{
              width: "100%",
              height: 50,
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              borderColor: COLORS.lightWhite,
              borderWidth: 0.5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              getUserdata();
              postRating();
            }}
          >
            <Text style={styles.small}>SUBMIT RATING</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddRating;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  ratingBox: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
    height: 140,
    backgroundColor: "#c2f0ff59",
    borderRadius: 12,
  },
  image: {
    position: "absolute",
    zIndex: 999,
    top: -30,
  },
  small: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.lightWhite,
  },
});
