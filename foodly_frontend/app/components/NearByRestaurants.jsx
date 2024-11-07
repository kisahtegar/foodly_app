import React from "react";
import StoreComponent from "./StoreComponent";
import uidata from "../constants/uidata";
import { FlatList, StyleSheet, View } from "react-native";

const NearByRestaurants = () => {
  return (
    <View style={{ marginLeft: 12 }}>
      <FlatList
        data={uidata.restaurants}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5, rowGap: 10 }}
        scrollEnabled
        renderItem={({ item }) => (
          <StoreComponent item={item} onPress={() => {}} />
        )}
      />
    </View>
  );
};

export default NearByRestaurants;

const styles = StyleSheet.create({});
