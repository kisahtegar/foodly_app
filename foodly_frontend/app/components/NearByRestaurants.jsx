import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import StoreComponent from "./StoreComponent";
import uidata from "../constants/uidata";
import { RestaurantContext } from "../context/RestaurantContext";
import { FlatList, StyleSheet, View } from "react-native";

const NearByRestaurants = () => {
  const navigation = useNavigation();
  const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext);

  return (
    <View style={{ marginLeft: 12 }}>
      <FlatList
        data={uidata.restaurants}
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
