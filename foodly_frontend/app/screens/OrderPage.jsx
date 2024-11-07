import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

const OrderPage = () => {
  const route = useRoute();
  const order = route.params;

  return (
    <View>
      <Text>OrderPage</Text>
    </View>
  );
};

export default OrderPage;

const styles = StyleSheet.create({});
