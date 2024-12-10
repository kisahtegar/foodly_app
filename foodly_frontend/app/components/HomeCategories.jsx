import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import uidata from "../constants/uidata";
import CategoryFoodComp from "./CategoryFoodComp";
import { useNavigation } from "@react-navigation/native";
import ReusableShimmer from "./Shimmers/ReusableShimmer";
import { SIZES } from "../constants/theme";

const HomeCategories = ({ category, isLoading }) => {
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={{ marginTop: 5 }}>
        <FlatList
          data={uidata.foods}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 5 }}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
              <ReusableShimmer
                width={SIZES.width - 20}
                height={120}
                radius={12}
              />
            </View>
          )}
        />
      </View>
    );
  }

  const renderCategoryItem = ({ item }) => (
    <CategoryFoodComp item={item} onPress={() => {}} />
  );
  return (
    <View style={{ marginLeft: 12, marginBottom: 12 }}>
      <FlatList
        data={category}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 10 }}
        scrollEnabled={false}
        renderItem={renderCategoryItem}
      />
    </View>
  );
};

export default HomeCategories;
