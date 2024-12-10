import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import StoreComponent from "./StoreComponent";
import uidata from "../constants/uidata";
import { RestaurantContext } from "../context/RestaurantContext";
import fetchNearBy from "../hook/nearByRestaurants";
import { SIZES } from "../constants/theme";
import ReusableShimmer from "./Shimmers/ReusableShimmer";

const NearByRestaurants = ({ code }) => {
  const navigation = useNavigation();
  const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext);

  const { restaurants, isLoading, error, refetch } = fetchNearBy(code);
  console.log("NearByRestaurants.restaurant: ", restaurants);

  if (isLoading) {
    return (
      <FlatList
        data={uidata.foods}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ marginTop: 5, rowGap: 5 }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginLeft: 12 }}>
            <ReusableShimmer
              width={SIZES.width - 80}
              height={SIZES.height / 5.3}
              radius={16}
            />
          </View>
        )}
      />
    );
  }

  return (
    <View style={{ marginLeft: 12 }}>
      <FlatList
        data={restaurants}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5, rowGap: 10 }}
        scrollEnabled
        renderItem={({ item }) => (
          <StoreComponent
            item={item}
            onPress={() => {
              navigation.navigate("restaurant", item), setRestaurantObj(item);
            }}
          />
        )}
      />
    </View>
  );
};

export default NearByRestaurants;

const styles = StyleSheet.create({});
