import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { RestaurantContext } from "../../context/RestaurantContext";
import FoodTile from "../../components/FoodTile";
import uidata from "../../constants/uidata";

const New = () => {
  const navigation = useNavigation();
  const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext);

  return (
    <View style={{ marginTop: 5 }}>
      <FlatList
        data={uidata.foods}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item._id}
        scrollEnabled
        renderItem={({ item }) => (
          <FoodTile
            item={item}
            showDetails={() => navigation.navigate("food-nav", item)}
          />
        )}
      />
    </View>
  );
};

export default New;

const styles = StyleSheet.create({});
