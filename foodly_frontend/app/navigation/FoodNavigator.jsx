import FoodPage from "../screens/FoodPage";
import OrderPage from "../screens/OrderPage";
import React from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const FoodNavigator = () => {
  const route = useRoute();
  const item = route.params;

  return (
    <Stack.Navigator initialRouteName="food-page">
      <Stack.Screen
        name="food-page"
        component={FoodPage}
        options={{ headerShown: false }}
        initialParams={{ item: item }}
      />

      <Stack.Screen
        name="order-page"
        component={OrderPage}
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};

export default FoodNavigator;

const styles = StyleSheet.create({});
