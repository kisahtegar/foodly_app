import fetchCategories from "../hook/categoryHook";
import CategoryItem from "./CategoryItem";
import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import ReusableShimmer from "./Shimmers/ReusableShimmer";
import { useNavigation } from "@react-navigation/native";

const CategoryList = ({
  setSelectedCategory,
  setSelectedSection,
  setSelectedValue,
  catValue,
}) => {
  const [selected, setSelected] = useState(null);
  const { categories, isLoading, error, refetch } = fetchCategories();
  const navigation = useNavigation();
  const restaurantShimmer = [1, 2, 3, 4, 5, 6, 7];

  const handleSelectedCategory = (item) => {
    if (selected === item.value) {
      setSelectedCategory(null);
      setSelected(null);
      setSelectedSection(null);
      setSelectedValue(null);
    } else if (item.title === "More") {
      navigation.navigate("more_categories");
    } else {
      setSelectedCategory(item._id);
      setSelected(item.value);
      setSelectedSection("category");
      setSelectedValue(item.title);
    }
  };

  if (isLoading) {
    return (
      <FlatList
        data={restaurantShimmer}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ marginTop: 5 }}
        scrollEnabled
        renderItem={({ item }) => (
          <View style={{ marginLeft: 12 }}>
            <ReusableShimmer
              width={80}
              height={55}
              radius={16}
              marginRight={12}
            />
          </View>
        )}
      />
    );
  }

  return (
    <FlatList
      data={categories}
      showsHorizontalScrollIndicator={false}
      horizontal
      style={{ marginTop: 5 }}
      keyExtractor={(item) => item._id}
      scrollEnabled
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            handleSelectedCategory(item);
          }}
        >
          <CategoryItem category={item} selected={selected} />
        </TouchableOpacity>
      )}
    />
  );
};

export default CategoryList;
