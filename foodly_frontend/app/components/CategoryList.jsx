import uidata from "../constants/uidata";
import fetchCategories from "../hook/categoryHook";
import CategoryItem from "./CategoryItem";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import ReusableShimmer from "./Shimmers/ReusableShimmer";

const CategoryList = ({
  setSelectedCategory,
  setSelectedSection,
  setSelectedValue,
}) => {
  const [selected, setSelected] = useState(null);
  const { categories, isLoading, error, refetch } = fetchCategories();

  const handleSelectedCategory = (item) => {
    if (selected == item.value) {
      setSelectedCategory(null);
      setSelected(null);
      setSelectedSection(null);
      setSelectedValue(null);
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
        data={uidata.categories}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item._id}
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
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleSelectedCategory(item)}>
          <CategoryItem selected={selected} category={item} />
        </TouchableOpacity>
      )}
    />
  );
};

export default CategoryList;

const styles = StyleSheet.create({});
