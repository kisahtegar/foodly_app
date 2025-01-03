import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import fetchCategories from "../../hook/categoryHook";
import HorizontalShimmer from "../../components/Shimmers/HorizontalShimmer";
import { COLORS } from "../../constants/theme";
import { AntDesign } from "@expo/vector-icons";

const bkImg =
  "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734400159/images/randoms/ads-on-internet.png";

const MoreFoods = ({ navigation }) => {
  const { categories, isLoading, error, refetch } = fetchCategories();

  if (isLoading === true) {
    return <HorizontalShimmer />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => {}}>
      <View style={{ flexDirection: "row", alignContent: "space-between" }}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={styles.text}>{item.title}</Text>
      </View>

      <AntDesign name="right" size={24} color={COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* <Image
        source={{
          uri: bkImg,
        }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={0}
      /> */}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default MoreFoods;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    // alignItems: "",
    justifyContent: "space-between",
    padding: 10,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: COLORS.gray2,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray,
  },
});
