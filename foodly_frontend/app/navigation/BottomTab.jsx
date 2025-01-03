import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Home from "../screens/Home";
import Search from "../screens/Search";
import { COLORS } from "../constants/theme";
import Profile from "../screens/Profile";
import LoginPage from "../screens/LoginPage";
import Cart from "../screens/Cart";
import { CartCountContext } from "../context/CartCountContext";
import { CheckLoadRestaurantData } from "../context/CheckRestaurantData";
import { LoginContext } from "../context/LoginContext";
import { ProfileTabContext } from "../context/ProfileTabContext";

const Tab = createBottomTabNavigator();

const tabBarStyle = {
  backgroundColor: COLORS.primary,
  borderTopWidth: 0,
  elevation: 0, // This will remove the shadow on Android
  shadowOpacity: 0, // This will remove the shadow on iOS
};

const BottomTab = () => {
  // const {count, isCartLoading, error, refetch} =fetchCartCount();
  const [profile, setProfile] = useState(false);
  const { cartCount, setCartCount } = useContext(CartCountContext);
  const { profileTab, setProfileTab } = useContext(ProfileTabContext);
  const { login, setLogin } = useContext(LoginContext);
  const { loadRestaurantData, setLoadRestaurantData } = useContext(
    CheckLoadRestaurantData
  );

  if (loadRestaurantData) {
    setLoadRestaurantData(false);
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={COLORS.secondary}
      tabBarHideKeyBoard={true}
      headerShown={false}
      inactiveColor="#3e2465"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          unmountOnBlur: loadRestaurantData == true ? true : false,
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (profile === false) {
              setProfile(true);
            }
            return (
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                color={focused ? COLORS.secondary : COLORS.secondary1}
                size={26}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "search" : "search"}
              color={focused ? COLORS.secondary : COLORS.secondary1}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 26, height: 26, position: "relative" }}>
              <FontAwesome
                name={focused ? "opencart" : "opencart"}
                color={focused ? COLORS.secondary : COLORS.secondary1}
                size={26}
              />

              <View
                style={{
                  position: "absolute",
                  right: -6,
                  top: -3,
                  backgroundColor: "red",
                  borderRadius: 7,
                  width: 14,
                  height: 14,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 10 }}>
                  {cartCount}
                </Text>
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={login === false ? LoginPage : Profile}
        options={{
          unmountOnBlur: true,
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={focused ? COLORS.secondary : COLORS.secondary1}
                size={26}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
