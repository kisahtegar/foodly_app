import { View, FlatList } from "react-native";
import React from "react";
import CategoryFoodComp from "./CategoryFoodComp";
import { useNavigation } from "@react-navigation/native";
import CookLoader from "./CookLoader";

const HomeCategory = ({ category, isLoading }) => {
  const navigation = useNavigation();
  const renderCategoryFoodComp = ({ item }) => (
    <CategoryFoodComp
      item={item}
      onPress={() => navigation.navigate("food-nav", item)}
    />
  );

  if (isLoading) {
    return <CookLoader />;
  }
  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={category}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 10 }}
        scrollEnabled={false}
        renderItem={renderCategoryFoodComp}
      />
    </View>
  );
};

export default HomeCategory;
