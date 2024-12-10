import FoodComponent from "./FoodComponent";
import React from "react";
import uidata from "../constants/uidata";
import { StyleSheet, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import fetchRecommendations from "../hook/recommendationsHook";
import ReusableShimmer from "./Shimmers/ReusableShimmer";
import { SIZES } from "../constants/theme";

const NewFoodList = ({ code }) => {
  const navigation = useNavigation();
  const { recommendations, isLoading, error, refetch } =
    fetchRecommendations(code);

  if (isLoading) {
    return (
      <FlatList
        data={uidata.foods}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ marginTop: 5, rowGap: 5 }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginLeft: 12 }}>
            <ReusableShimmer
              width={SIZES.width - 80}
              height={SIZES.height / 5.3}
              radius={16}
            />
          </View>
        )}
      />
    );
  }

  const renderItem = ({ item }) => (
    <FoodComponent
      item={item}
      onPress={() => navigation.navigate("food-nav", item)}
    />
  );

  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={recommendations}
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
