import NetworkImage from "../../components/NetworkImage";
import RestaurantPage from "../../navigation/RestaurantPage";
import { SIZES } from "../../constants/theme.js";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

const Restaurant = ({ navigation }) => {
  const route = useRoute();
  const item = route.params;
  console.log(item);

  return (
    <View>
      <NetworkImage
        data={item.imageUrl}
        height={SIZES.height / 3.4}
        width={SIZES.width}
      />
      <View style={{ height: 200 }}></View>
      <View style={{ height: 600 }}>
        <RestaurantPage />
      </View>
    </View>
  );
};

export default Restaurant;

const styles = StyleSheet.create({});
