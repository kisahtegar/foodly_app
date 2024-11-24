import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { RestaurantContext } from "../../context/RestaurantContext";
import uidata from "../../constants/uidata";
import CategoryFoodComp from "../../components/CategoryFoodComp";

const Menu = () => {
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
          <View style={{ left: 10 }}>
            <CategoryFoodComp
              item={item}
              onPress={() => navigation.navigate("food-nav", item)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Menu;
