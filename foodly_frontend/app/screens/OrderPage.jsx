import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import fetchDefaultAddress from "../hook/fetchDefaultAddress";
import LoadingScreen from "../components/LoadingScreen";
import axios from "axios";
import { COLORS } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderPage = () => {
  const route = useRoute();
  const order = route.params;
  deliveryfee = 2;
  const { defaultAddress, isLoading, error, refetch } = fetchDefaultAddress();

  let orderObject;

  if (isLoading) {
    <LoadingScreen />;
  }

  if (defaultAddress !== null) {
    orderObject = {
      userId: defaultAddress.userId,
      orderItems: [order.orderItem],
      orderTotal: order.orderItem.price,
      deliveryFee: deliveryfee,
      grandTotal:
        order.orderItem.price * order.orderItem.quantity + deliveryfee,
      deliveryAddress: defaultAddress._id,
      paymentMethod: "Stripe",
      restaurantId: order.restaurant,
    };
  }

  const createOrder = async (orderObject) => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);

    try {
      const response = await axios.post(
        "http://192.168.0.17:6002/api/orders",
        orderObject,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.orderBtn}
        onPress={() => createOrder(orderObject)}
      >
        <Text>Create Order</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderPage;

const styles = StyleSheet.create({
  orderBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: COLORS.secondary,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
});
