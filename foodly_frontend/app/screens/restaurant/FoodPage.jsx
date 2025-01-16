import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { BaseUrl, COLORS, SIZES } from "../../constants/theme";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Counter from "../../components/Counter";
import axios from "axios";
import { CartCountContext } from "../../context/CartCountContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RestaurantContext } from "../../context/RestaurantContext";

const FoodPage = ({ navigation, route }) => {
  const item = route.params.item;
  const [isChecked, setChecked] = useState(false);
  const [addittives, setAddittives] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { cartCount, setCartCount } = useContext(CartCountContext);
  const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext);
  const [count, setCount] = useState(1);
  const [data, setData] = useState(false);
  const [preference, setPreference] = useState("");

  console.log("item", item);

  const id = item.restaurant;

  sendToOrderPage = {
    orderItem: {
      foodId: item._id,
      quantity: count,
      addittives: addittives,
      instructions: preference,
      price: (item.price + totalPrice) * count,
      title: item.title,
      imageUrl: item.imageUrl[0],
      time: "10:00",
    },
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl[0],
    restaurant: id,
  };

  const handleAdditive = (newAdditive) => {
    setAddittives((prevAddittives) => {
      // Check if the additive exists in the current state
      const exists = prevAddittives.some(
        (additive) => additive.id === newAdditive.id
      );

      if (exists) {
        // Remove the additive from the list
        return prevAddittives.filter(
          (additive) => additive.id !== newAdditive.id
        );
      } else {
        // Add the additive to the list
        return [...prevAddittives, newAdditive];
      }
    });
  };

  const handlePress = (item) => {
    const cartItem = {
      productId: item._id,
      additives: addittives,
      quantity: count,
      totalPrice: (item.price + totalPrice) * count,
    };

    addToCart(cartItem);
  };

  const addToCart = async (product) => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    try {
      const response = await axios.post(`${BaseUrl}/api/cart`, product, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCartCount(response.data.count);
    } catch (error) {
      console.error(
        "[FoodPage.addToCart]: There was a problem with the axios request:",
        error
      );
    }
  };

  const handleNavigation = () => {
    if (data === true) {
      navigation.navigate("restaurant", restaurantObj);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/restaurant/byId/${id}`);
      if (response.status === 200) {
        setData(true);
        setRestaurantObj(response.data);
      }
    } catch (error) {
      console.log("api error", error);
    }
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = addittives.reduce((sum, additive) => {
        return sum + parseFloat(additive.price);
      }, 0);

      setTotalPrice(total);
      fetchData();
    };

    calculateTotalPrice();
  }, [addittives]);

  return (
    <ScrollView style={{ backgroundColor: COLORS.lightWhite }}>
      <View>
        <Image
          source={{
            uri: item.imageUrl[0],
          }}
          style={{
            width: SIZES.width,
            height: SIZES.height / 4,
            borderBottomRightRadius: 30,
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backbtn}
        >
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.shareBtn}>
          <MaterialCommunityIcons
            name="share-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ position: "absolute", zIndex: 999, bottom: 30, right: 0 }}
          onPress={() => handleNavigation()}
        >
          <View
            style={{
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 15,
              padding: 10,
              marginRight: 10,
            }}
          >
            <Text style={{ color: COLORS.lightWhite }}>Buka Restaurant</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={[styles.title, { marginBottom: 10 }]}>{item.title}</Text>
          <Text style={[styles.title, { color: COLORS.primary }]}>
            Rp. {(item.price + totalPrice) * count}
          </Text>
        </View>

        <Text style={styles.small}>{item.description}</Text>

        <FlatList
          data={item.foodTags}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item}
          style={{ marginTop: 5 }}
          horizontal
          scrollEnabled
          renderItem={({ item }) => (
            <View
              style={{
                right: 10,
                marginHorizontal: 10,
                backgroundColor: COLORS.primary,
                borderRadius: 8,
              }}
            >
              <Text style={{ paddingHorizontal: 4, color: COLORS.lightWhite }}>
                {item}
              </Text>
            </View>
          )}
        />

        <Text style={[styles.title, { marginBottom: 10, marginTop: 20 }]}>
          Additives and Toppings
        </Text>

        <FlatList
          data={item.additives} // Make sure this data includes items for four rows with two items each
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 5 }}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <BouncyCheckbox
                size={20}
                fillColor={COLORS.primary}
                unfillColor="#FFFFFF"
                text={item.title}
                innerIconStyle={{ borderWidth: 1 }}
                textStyle={styles.small}
                onPress={() => {
                  handleAdditive(item);
                }}
              />

              <Text style={styles.small}>$ {item.price}</Text>
            </View>
          )}
        />

        <Text style={[styles.title, { marginBottom: 10, marginTop: 30 }]}>
          Preferences
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Add Specific Instructions"
            value={preference} // Step 3
            onChangeText={(value) => setPreference(value)} // Step 4
            autoCapitalize="none"
            autoCorrect={false}
            style={{ flex: 1 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={[styles.title, { marginBottom: 10 }]}>Quantity</Text>

          <Counter count={count} setCount={setCount} />
        </View>
      </View>

      <View style={styles.cartContainer}>
        <View style={styles.cart}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => handlePress(item)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="pluscircleo"
                size={24}
                color={COLORS.lightWhite}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("order-page", sendToOrderPage)}
              style={{
                backgroundColor: COLORS.primary,
                paddingHorizontal: 67,
                borderRadius: 30,
              }}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: COLORS.white,
                    marginTop: 8,
                    alignItems: "center",
                    fontSize: 18,
                  },
                ]}
              >
                Order Now
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={[styles.title, { color: COLORS.lightWhite }]}>
                {cartCount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default FoodPage;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  backbtn: {
    marginLeft: 12,
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    top: SIZES.xxLarge,
  },
  shareBtn: {
    marginRight: 12,
    position: "absolute",
    right: 0,
    zIndex: 999,
    top: SIZES.xxLarge,
  },
  wrapper: {
    marginRight: 15,
    backgroundColor: COLORS.lightWhite,
    padding: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "medium",
    color: COLORS.black,
  },
  small: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  cartContainer: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  cart: {
    width: SIZES.width - 24,
    height: 60,
    justifyContent: "center",
    backgroundColor: COLORS.primary1,
    borderRadius: 30,
  },
  inputWrapper: {
    borderColor: COLORS.primary1,
    backgroundColor: COLORS.offwhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
  },
});
