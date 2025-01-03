import { FlatList, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import fetchCart from "../hook/fetchCart";
import { BaseUrl, COLORS, SIZES } from "../constants/theme";
import CartItem from "../components/CartItem";
import ReusableHeader from "../components/ReusableHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CartCountContext } from "../context/CartCountContext";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const { cartList, isCartLoading, error, refetch } = fetchCart();
  const { cartCount, setCartCount } = useContext(CartCountContext);

  const renderCartItem = ({ item }) => (
    <CartItem
      deleteItem={() => deleteCartItem(item._id)}
      item={item}
      onPress={() => navigation.navigate("food-page")}
    />
  );

  const deleteCartItem = async (id) => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);

    try {
      const response = await axios.delete(`${BaseUrl}/api/cart/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("[Cart.deleteCartItem]: response.data = ", response.data);
      setCartCount(response.data.cartCount);
    } catch (error) {
      console.error(
        "[Cart.deleteCartItem]: There was a problem with the axios request:",
        error
      );
    }
  };

  useEffect(() => {
    refetch();
  }, [cartCount]);

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
          <ReusableHeader title={"Cart"} backbtn={false} />

          <View style={{ marginLeft: 12, marginBottom: 10 }}>
            <FlatList
              data={cartList}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              style={{ marginTop: 10 }}
              scrollEnabled
              renderItem={renderCartItem}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Cart;
