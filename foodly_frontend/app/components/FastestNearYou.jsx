import React from "react";
import FoodComponent from "./FoodComponent";
import uidata from "../constants/uidata";
import { FlatList, StyleSheet, View } from "react-native";

const FastestNearYou = () => {
  const renderItem = ({ item }) => (
    <FoodComponent item={item} onPress={() => {}} />
  );

  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={uidata.foods}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5, rowGap: 10 }}
        scrollEnabled
        renderItem={renderItem}
      />
    </View>
  );
};

export default FastestNearYou;

const styles = StyleSheet.create({});
