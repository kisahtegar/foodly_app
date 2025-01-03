import { FlatList, View } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import StoreComponent from "./StoreComponent";
import { RestaurantContext } from "../context/RestaurantContext";
import { SIZES } from "../constants/theme";
import fetchNearByRestaurants from "../hook/fetchNearByRestaurants";
import ReusableShimmer from "./Shimmers/ReusableShimmer";

const NearByRestaurants = ({ code }) => {
  const navigation = useNavigation();
  const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext);
  const { restaurants, isLoading, error, refetch } =
    fetchNearByRestaurants(code);
  const restaurantShimmer = [1, 2, 3, 4];

  if (isLoading) {
    return (
      <View style={{ marginLeft: 12, marginBottom: 10 }}>
        <FlatList
          data={restaurantShimmer}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 5, rowGap: 10 }}
          horizontal
          scrollEnabled
          renderItem={({ item }) => (
            <View style={{ marginRight: 15 }}>
              <ReusableShimmer
                width={SIZES.width - 80}
                height={SIZES.height / 5.3}
                radius={16}
              />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={restaurants}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5 }}
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
