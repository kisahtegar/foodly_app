import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import ReusableHeader from "../components/ReusableHeader";
import fetchDefaultAddress from "../hook/fetchDefaultAddress";
import CookLoader from "../components/CookLoader";
import { BaseUrl, COLORS, SIZES } from "../constants/theme";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
import { LoginContext } from "../context/LoginContext";
import Toast from "react-native-toast-message";

const Orders = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const orderItem = route.params;
  const [tokenVal, setTokenVal] = useState(null);
  const deliveryFee = 1.2;
  const [paymentUrl, setPaymentUrl] = useState(false);
  const [result, setResult] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { login, setLogin } = useContext(LoginContext);

  const { defaultAddress, isAddressLoading, error, refetch } =
    fetchDefaultAddress();

  let orderObject;

  if (isAddressLoading) {
    return <CookLoader />;
  }

  if (defaultAddress !== null) {
    orderObject = {
      userId: defaultAddress.userId,
      orderItems: [orderItem.orderItem],
      orderTotal: orderItem.orderItem.price,
      deliveryFee: deliveryFee,
      grandTotal: orderItem.orderItem.quantity + deliveryFee,
      deliveryAddress: defaultAddress._id,
      paymentMethod: "Stripe",
      restaurantId: orderItem.restaurant,
    };
  } else {
    Toast.show({
      type: "error",
      text1: "User address",
      text2: "No delivery address found as default",
      text1Style: { fontSize: 18, fontWeight: "bold" },
      text2Style: { fontSize: 16, color: "red" },
    });
  }
  const createOrder = async (orderObject) => {
    if (defaultAddress === null) {
      console.log("No default address found");
      return;
    }
    const token = await AsyncStorage.getItem("token");
    if (token === null) {
      console.log("You must login ");
      setTokenVal(null);
      return;
    } else {
      setTokenVal(token);
    }
    const accessToken = JSON.parse(token);
    try {
      console.log("--------creating--------");
      console.log("additives ", orderItem.orderItem.addittives);
      console.log("order objects ", orderObject);
      const response = await axios.post(`${BaseUrl}/api/orders`, orderObject, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        setOrderId(response.data.data._id);
        createCheckOut(response.data.data._id);

        Toast.show({
          type: "success",
          text1: "Order created successfully",
          text2: "Proceeding to payment",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 16, color: "red" },
        });
      }
      if (orderId !== null) {
        console.log("placing order");
        createCheckOut();
      }
    } catch (error) {
      console.error("There was a problem with the axios request:", error);
      Toast.show({
        type: "error",
        text1: "Order creation failed",
        text2: error.message,
        text1Style: { fontSize: 18, fontWeight: "bold" },
        text2Style: { fontSize: 16, color: "red" },
      });
    }
  };

  const createCheckOut = async (orderId) => {
    try {
      const response = await axios.post(
        "https://0402-128-14-21-14.ngrok-free.app/stripe/create-checkout-session",
        {
          userId: defaultAddress.userId,
          cartItems: [
            {
              name: orderItem.title,
              id: orderId,
              price: orderItem.orderItem.price,
              quantity: orderItem.orderItem.quantity,
              restaurantId: orderItem.restaurant,
            },
          ],
        }
      );

      const data = response.data;
      setPaymentUrl(data.url);

      await WebBrowser.openBrowserAsync(data.url);
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.error(`HTTP error! Status: ${error.response.status}`);
        Toast.show({
          type: "error",
          text1: "Checkout failed",
          text2: `Status: ${error.response.status}`,
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 16, color: "red" },
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response was received for the request");
        Toast.show({
          type: "error",
          text1: "Checkout failed",
          text2: "No response received",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 16, color: "red" },
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", error.message);
        Toast.show({
          type: "error",
          text1: "Checkout failed",
          text2: error.message,
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 16, color: "red" },
        });
      }
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <ReusableHeader title={"Order Now"} backbtn={false} />

      <View>
        <View>
          <View
            style={{
              marginHorizontal: 10,
              marginBottom: 20,
              backgroundColor: COLORS.lightWhite,
              height: 75,
              padding: 5,
              borderRadius: 12,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: orderItem.imageUrl }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 99,
                }}
              />
              <View>
                <Text style={styles.text}>{orderItem.title}</Text>
                <Text
                  style={[styles.email, { width: SIZES.width * 0.75 }]}
                  numberOfLines={2}
                >
                  {orderItem.description}
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={[
              styles.text,
              { left: 3, marginTop: 5, marginBottom: 10, fontSize: 14 },
            ]}
          >
            Address and Instructions
          </Text>

          <View
            style={{
              marginHorizontal: 10,
              backgroundColor: COLORS.lightWhite,
              height: 50,
              padding: 5,
              borderRadius: 12,
            }}
          >
            <Text style={styles.email}>
              {defaultAddress !== null
                ? `${defaultAddress.addressLine1} ${defaultAddress.district} ${defaultAddress.city}`
                : ""}
            </Text>

            <Text style={styles.email}>
              {defaultAddress !== null
                ? `${defaultAddress.deliveryInstructions}`
                : ""}
            </Text>
          </View>

          <Text style={[styles.text, { left: 3, marginTop: 16, fontSize: 14 }]}>
            Order Details
          </Text>

          <View
            style={{
              marginTop: 10,
              marginHorizontal: 10,
              backgroundColor: COLORS.lightWhite,
              height: 90,
              padding: 5,
              borderRadius: 12,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>Approx Time :</Text>
              <Text style={styles.email}> 30 min</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>Delivery Cost :</Text>
              <Text style={styles.email}> $ 1.05</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>Total Quantity :</Text>
              <Text
                style={styles.email}
              >{`${orderItem.orderItem.quantity}`}</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>Total Cost :</Text>
              <Text style={styles.email}> $37.00</Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 20,
              marginHorizontal: 10,
              backgroundColor: COLORS.primary,
              borderColor: COLORS.tertiary,
              borderWidth: 0.5,
              height: 40,
              padding: 5,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              if (login === false || login === null) {
                navigation.navigate("login");
                return;
              }
              createOrder(orderObject);
            }}
          >
            <Text style={[styles.text, { color: COLORS.lightWhite }]}>
              Proceed to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  text: {
    marginLeft: 10,
    fontFamily: "medium",
    color: COLORS.gray,
  },
  email: {
    marginLeft: 10,
    fontFamily: "regular",
    color: COLORS.gray,
  },
});
