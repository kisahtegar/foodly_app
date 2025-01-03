import {
  Text,
  View,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BaseUrl, COLORS, SIZES } from "../constants/theme";
import { Feather, AntDesign } from "@expo/vector-icons";
import styles from "./search.style";
import { RatingInput } from "react-native-stock-star-rating";
import LottieView from "lottie-react-native";
import axios from "axios";

const Search = ({ navigation }) => {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const animation = useRef(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}/api/foods/search/${searchKey}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.log("[Search.handleSearch]: Failed to get products = ", error);
    }
  };

  const clearSearch = async () => {
    setSearchKey("");
    setSearchResults([]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("food-nav", item);
      }}
    >
      <View style={styles.outter}>
        <Image source={{ uri: item.imageUrl[0] }} style={styles.image} />
        <View style={styles.titlesContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View>
            <Text style={styles.description}>
              Delivery estimated under {item.time}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RatingInput
              rating={item.rating}
              size={14}
              maxStars={5}
              setRating={item.rating}
              bordered={false}
              color={COLORS.primary}
            />

            <Text style={[styles.description, { marginLeft: 10 }]}>
              {item.ratingCount}+ ratings
            </Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>$ {item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: COLORS.primary, height: SIZES.height }}>
        <View
          style={{
            backgroundColor: COLORS.offwhite,
            height: SIZES.height - 80,
            borderBottomEndRadius: 30,
            borderBottomStartRadius: 30,
          }}
        >
          <View style={styles.searchContainer}>
            {searchResults.length > 0 && (
              <TouchableOpacity style={styles.searchBtn} onPress={clearSearch}>
                <AntDesign name="closecircle" size={24} color={COLORS.red} />
              </TouchableOpacity>
            )}
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.input}
                value={searchKey}
                onChangeText={setSearchKey}
                placeholder="What do you want to eat?"
              />
            </View>

            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Feather name="search" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          {searchResults.length === 0 ? (
            <View
              style={{
                width: SIZES.width,
                height: SIZES.height / 1.5,
                right: 90,
              }}
            >
              <LottieView
                autoPlay
                ref={animation}
                style={{ width: "100%", height: "100%" }}
                source={require("../../assets/anime/cook.json")}
              />
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Search;
