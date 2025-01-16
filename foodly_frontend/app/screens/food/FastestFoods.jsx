import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import fetchFoodRecommendations from "../../hook/fetchFoodRecommendations";
import HorizontalShimmer from "../../components/Shimmers/HorizontalShimmer";
import { COLORS } from "../../constants/theme";

const bkImg =
  "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734400159/images/randoms/ads-on-internet.png";

const FastestFoods = ({ navigation }) => {
  const { recommendations, isLoading, error, refetch } =
    fetchFoodRecommendations("banten");

  if (isLoading) {
    return <HorizontalShimmer />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("food-nav", item);
      }}
    >
      <Image source={{ uri: item.imageUrl[0] }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subTitle} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View
        style={[
          styles.statusContainer,
          item.isAvailable ? styles.open : styles.closed,
        ]}
      >
        <Text style={styles.statusText}>
          {item.isAvailable ? item.time : item.time}
        </Text>
      </View>
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
        data={recommendations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default FastestFoods;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  subTitle: {
    width: "90%",
    fontSize: 12,
    color: "gray",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  statusContainer: {
    position: "absolute",
    top: 15,
    right: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    justifyContent: "center",
  },
  open: {
    backgroundColor: COLORS.primary,
  },
  closed: {
    backgroundColor: COLORS.red,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
  },
});
