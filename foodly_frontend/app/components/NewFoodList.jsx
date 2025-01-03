import FoodComponent from "./FoodComponent";
import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import fetchFoodRecommendations from "../hook/fetchFoodRecommendations";
import ReusableShimmer from "./Shimmers/ReusableShimmer";
import { COLORS, SIZES } from "../constants/theme";

const NewFoodList = ({ code }) => {
  const navigation = useNavigation();
  const restaurantShimmer = [1, 2, 3, 4];
  const { recommendations, isLoading, error, refetch } =
    fetchFoodRecommendations();

  if (isLoading) {
    return (
      <View style={{ marginLeft: 12, marginBottom: 10 }}>
        <FlatList
          data={restaurantShimmer}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 5, rowGap: 10 }}
          horizontal
          scrollEnabled
          renderItem={({ item }) => (
            <View style={{ marginRight: 15 }}>
              <ReusableShimmer
                width={SIZES.width - 80}
                height={SIZES.height / 5.3}
                radius={16}
              />
            </View>
          )}
        />
      </View>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <View style={styles.noFoodContainer}>
        <Text style={styles.noFoodText}>
          No food found due to no address found
        </Text>
      </View>
    );
  }

  const renderFoodItem = ({ item }) => {
    if (!item) {
      return (
        <View style={styles.noFoodContainer}>
          <Text style={styles.noFoodText}>
            No food found due to no address found
          </Text>
        </View>
      );
    }

    return (
      <FoodComponent
        item={item}
        onPress={() => navigation.navigate("food-nav", item)}
      />
    );
  };

  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={recommendations}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 5 }}
        horizontal
        scrollEnabled
        renderItem={renderFoodItem}
      />
    </View>
  );
};

export default NewFoodList;

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: "medium",
    marginTop: 5,
  },
  small: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  noFoodContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: SIZES.height / 3,
  },
  noFoodText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: "medium",
  },
});
