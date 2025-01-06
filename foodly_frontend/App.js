import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

import { useInitializeNotifications } from "./app/hook/useInitializeNotifications";
import { useFontsInitialization } from "./app/hook/useFontsInitialization";
import { useInitializeLocation } from "./app/hook/useInitializeLocation";

import SignUp from "./app/screens/SignUp";
import ResturantPage from "./app/screens/restaurant/ResturantPage";
import RestaurantPage from "./app/navigation/RestaurantPage";
import AddRating from "./app/screens/AddRating";
import FoodNavigator from "./app/navigation/FoodNavigator";
import LoginPage from "./app/screens/LoginPage";
import VerificationPage from "./app/screens/VerificationPage";
import OtpScreen from "./app/screens/OtpScreen";
import ShippingAddress from "./app/screens/ShippingAddress";
import FetchOrders from "./app/screens/FetchOrders";
import AddAddressess from "./app/screens/addresses/AddAddresses";
import DefaultAddress from "./app/screens/addresses/DefaultAddress";
import MoreFoods from "./app/screens/food/MoreFoods";
import AllRestaurants from "./app/screens/food/AllRestaurants";
import FastestFoods from "./app/screens/food/FastestFoods";
import OrderDetails from "./app/screens/orders/OrderDetails";
import Profile from "./app/screens/Profile";
import LoadingScreen from "./app/components/LoadingScreen";
import BottomTab from "./app/navigation/BottomTab";

import { UserLocationContext } from "./app/context/UserLocationContext";
import { LoginContext } from "./app/context/LoginContext";
import { RestaurantContext } from "./app/context/RestaurantContext";
import { CheckUserAddressType } from "./app/context/CheckUserAddressType";
import { ProfileTabContext } from "./app/context/ProfileTabContext";
import { CartCountContext } from "./app/context/CartCountContext";
import { UserReversedGeoCode } from "./app/context/UserReversedGeoCode";
import { CheckLoadRestaurantData } from "./app/context/CheckRestaurantData";

const Stack = createNativeStackNavigator();

export default function App() {
  const [location, setLocation] = useState(null);
  const [login, setLogin] = useState(null);
  const [address, setAddress] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [restaurantObj, setRestaurantObj] = useState(null);
  const [checkUserAddressType, setCheckUserAddressType] = useState(false);
  const [loadRestaurantData, setLoadRestaurantData] = useState(false);
  const [profileTab, setProfileTab] = useState(false);

  useInitializeNotifications();
  const { fontsLoaded, onLayoutRootView } = useFontsInitialization();
  useInitializeLocation({ setLocation, setAddress, setLogin });

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ProfileTabContext.Provider value={{ profileTab, setProfileTab }}>
      <CheckLoadRestaurantData.Provider
        value={{ loadRestaurantData, setLoadRestaurantData }}
      >
        <CheckUserAddressType.Provider
          value={{ checkUserAddressType, setCheckUserAddressType }}
        >
          <UserLocationContext.Provider value={{ location, setLocation }}>
            <UserReversedGeoCode.Provider value={{ address, setAddress }}>
              <RestaurantContext.Provider
                value={{ restaurantObj, setRestaurantObj }}
              >
                <CartCountContext.Provider value={{ cartCount, setCartCount }}>
                  <LoginContext.Provider value={{ login, setLogin }}>
                    <NavigationContainer>
                      <Stack.Navigator>
                        <Stack.Screen
                          name="bottom-navigation"
                          component={BottomTab}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="restaurant"
                          component={ResturantPage}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="signUp"
                          component={SignUp}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="login"
                          component={LoginPage}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="rest-navigation"
                          component={RestaurantPage}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="verification_page"
                          component={VerificationPage}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="food-nav"
                          component={FoodNavigator}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="otp-screen"
                          component={OtpScreen}
                          options={{
                            headerShown: true,
                            title: "OTP Verification",
                          }}
                        />
                        <Stack.Screen
                          name="shipping-address"
                          component={ShippingAddress}
                          options={{ headerShown: true, title: "" }}
                        />
                        <Stack.Screen
                          name="default_add"
                          component={DefaultAddress}
                          options={{
                            headerShown: true,
                            title: "Set Default Address",
                          }}
                        />
                        <Stack.Screen
                          name="add-address"
                          component={AddAddressess}
                          options={{ headerShown: true, title: "Add Address" }}
                        />
                        <Stack.Screen
                          name="rating-page"
                          component={AddRating}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="more_categories"
                          component={MoreFoods}
                          options={{
                            headerShown: true,
                            title: "Explore Foods",
                          }}
                        />
                        <Stack.Screen
                          name="nearby_restaurants"
                          component={AllRestaurants}
                          options={{
                            headerShown: true,
                            title: "All Restaurants",
                          }}
                        />
                        <Stack.Screen
                          name="fastest"
                          component={FastestFoods}
                          options={{
                            headerShown: true,
                            title: "All Fastest Foods",
                          }}
                        />
                        <Stack.Screen
                          name="fetch_orders"
                          component={FetchOrders}
                          options={{ headerShown: true, title: "All orders" }}
                        />
                        <Stack.Screen
                          name="fetch_order_detail"
                          component={OrderDetails}
                          options={{
                            headerShown: false,
                            title: "Order details",
                          }}
                        />
                      </Stack.Navigator>
                    </NavigationContainer>
                    <Toast />
                  </LoginContext.Provider>
                </CartCountContext.Provider>
              </RestaurantContext.Provider>
            </UserReversedGeoCode.Provider>
          </UserLocationContext.Provider>
        </CheckUserAddressType.Provider>
      </CheckLoadRestaurantData.Provider>
    </ProfileTabContext.Provider>
  );
}
