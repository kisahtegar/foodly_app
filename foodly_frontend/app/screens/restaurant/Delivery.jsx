import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useContext } from "react";
import { COLORS, SIZES } from "../../constants/theme";
import FoodTile from "../../components/FoodTile";
import { useNavigation } from "@react-navigation/native";
import fetchFoodsByRest from "../../hook/fetchFoodsByRestaurant";
import { RestaurantContext } from "../../context/RestaurantContext";
import LoadingScreen from "../../components/LoadingScreen";
import { CartCountContext } from "../../context/CartCountContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookLoader from "../../components/CookLoader";

const Delivery = () => {
  const navigation = useNavigation();
  const { restaurantObj, setRestaurant } = useContext(RestaurantContext);
  const { cartCount, setCartCount } = useContext(CartCountContext);
  const { restaurantFoodList, isLoading, error, refetch } = fetchFoodsByRest(
    restaurantObj._id,
    restaurantObj.code
  );

  if (isLoading) {
    return <CookLoader />;
  }

  const handlePress = (item) => {
    const cartItem = {
      productId: item._id,
      additives: [],
      quantity: 1,
      totalPrice: item.price,
    };
    addToCart(cartItem);
  };

  const addToCart = async (product) => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    try {
      const response = await axios.post("BaseUrl/api/cart", product, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCartCount(response.data.count);
    } catch (error) {
      console.error("There was a problem with the axios request:", error);
    }
  };

  return (
    <View
      style={{ backgroundColor: COLORS.lightWhite, height: SIZES.height / 2 }}
    >
      <View style={{ marginLeft: 0, marginTop: 5 }}>
        <FlatList
          data={restaurantFoodList}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 5 }}
          keyExtractor={(item) => item._id}
          numColumns={2}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <FoodTile
              item={item}
              onPress={() => handlePress(item)}
              showDetails={() => navigation.navigate("food-nav", item)}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Delivery;

const styles = StyleSheet.create({});
