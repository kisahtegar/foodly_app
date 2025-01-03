import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useCallback, useEffect } from "react";
import Toast from "react-native-toast-message";

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

  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Poppins-Regular.ttf"),
    light: require("./assets/fonts/Poppins-Light.ttf"),
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    medium: require("./assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
    semibold: require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const initializeApp = async () => {
      const defaultAddress = {
        city: "Tangerang",
        country: "Indonesia",
        district: "Pasar Kemis",
        isoCountryCode: "ID",
        name: "Jl. Raya Pasar Kemis",
        postalCode: "15560", // Example postal code for Pasar Kemis
        region: "Banten",
        street: "Jl. Raya Pasar Kemis",
        streetNumber: "15", // You can adjust this based on the specific number
        subregion: "Kabupaten Tangerang",
        timezone: "Asia/Jakarta",
      };

      setAddress(defaultAddress);

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error(
            "[App.useEffect]: Permission to access location was denied"
          );
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        await AsyncStorage.setItem(
          "defaultLat",
          JSON.stringify(location.coords.latitude)
        );
        await AsyncStorage.setItem(
          "defaultLng",
          JSON.stringify(location.coords.longitude)
        );

        const rgc = await Location.reverseGeocodeAsync({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        });
        setAddress(rgc[0]);

        const userToken = await AsyncStorage.getItem("token");
        setLogin(userToken !== null);
      } catch (error) {
        console.error("[App.useEffect]: Error initializing location = ", error);
      }

      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.error(
            "[App.useEffect.initializeApp]: Permission to access notifications was denied"
          );
          return;
        } else {
          console.log(
            "[App.useEffect.initializeApp]: Permission to access notifications was granted"
          );
        }

        await AsyncStorage.setItem("fcm", JSON.stringify(token));
        console.log("[App.useEffect.initializeApp]: Expo Push Token = ", token);

        Notifications.addNotificationReceivedListener((notification) => {
          console.log(
            "[App.useEffect.initializeApp]: Notification received in foreground = ",
            notification
          );
        });

        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(
            "[App.useEffect.initializeApp]: Notification response received = ",
            response
          );
        });
      } catch (error) {
        console.error(
          "[App.useEffect.initializeApp]: Error setting up notifications = ",
          error
        );
      }
    };

    initializeApp();
  }, []);

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
