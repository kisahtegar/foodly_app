import FoodComponent from "./FoodComponent";
import React from "react";
import uidata from "../constants/uidata";
import { StyleSheet, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NewFoodList = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <FoodComponent
      item={item}
      onPress={() => navigation.navigate("food-nav", item)}
    />
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

export default NewFoodList;

const styles = StyleSheet.create({});
