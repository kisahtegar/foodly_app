import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import pages from "./page.style";
import { LoginContext } from "../context/LoginContext";
import fetchCart from "../hook/fetchCart";
import ReusableHeader from "../components/ReusableHeader";
import CartComponent from "../components/CartComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CartCountContext } from "../context/CartCountContext";

const Cart = () => {
  const { login, setLogin } = useContext(LoginContext);
  const { cartList, isCartLoading, error, refetch } = fetchCart();
  const { cartCount, setCartCount } = useContext(CartCountContext);

  const deleteItem = async (id) => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);

    try {
      const response = await axios.delete(
        `http://192.168.0.17:6002/api/cart/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setCartCount(response.data.cartCount);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    refetch();
  }, [cartCount]);

  return (
    <SafeAreaView>
      <View style={pages.viewOne}>
        <View style={pages.viewTwo}>
          <ReusableHeader title={"Cart"} backbtn={false} />

          <View style={{ marginLeft: 12, marginBottom: 10 }}>
            <FlatList
              data={cartList}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              style={{ marginTop: 10 }}
              scrollEnabled
              renderItem={({ item }) => (
                <CartComponent
                  item={item}
                  deleteItem={() => deleteItem(item._id)}
                />
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({});
