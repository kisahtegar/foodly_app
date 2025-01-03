import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useContext } from "react";
import { COLORS, SIZES } from "../constants/theme";
import { LoginContext } from "../context/LoginContext";
import NetworkImage from "../components/NetworkImage";
import ProfileTile from "../components/ProfileTile";
import RegistrationTile from "../components/RegistrationTile";
import LoadingScreen from "../components/LoadingScreen";
import fetchProfile from "../hook/fetchProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckUserAddressType } from "../context/CheckUserAddressType";

const Profile = ({ navigation }) => {
  const { login, setLogin } = useContext(LoginContext);
  const { user, isProfileLoading, error, refetch } = fetchProfile();
  const { checkUserAddressType, setCheckUserAddressType } =
    useContext(CheckUserAddressType);
  const profile =
    "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734440457/images/peoples/guy-1.png";
  const bkImg =
    "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734400159/images/randoms/ads-on-internet.png";

  if (isProfileLoading) {
    return <LoadingScreen />;
  }

  const logout = async () => {
    await AsyncStorage.clear();
    setLogin(false);
    setCheckUserAddressType(false);
    navigation.navigate("login");
  };

  return (
    <View>
      <View style={{ backgroundColor: COLORS.primary, height: SIZES.height }}>
        <View
          style={{
            backgroundColor: COLORS.offwhite,
            height: SIZES.height - 56,
            borderBottomEndRadius: 30,
            borderBottomStartRadius: 30,
          }}
        >
          {/* <Image
            source={{ uri: bkImg }}
            style={[
              StyleSheet.absoluteFillObject,
              {
                opacity: 0.7,
              },
            ]}
          /> */}
          <View style={styles.profile}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <NetworkImage
                source={user === null ? profile : user.profile}
                width={45}
                height={45}
                radius={99}
              />
              <View style={{ marginLeft: 10, marginTop: 3 }}>
                <Text style={styles.text}>
                  {user === null ? "" : user.username}
                </Text>
                <Text style={styles.email}>
                  {user === null ? "" : user.email}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => logout()}>
              <AntDesign
                name={user === null ? "login" : "logout"}
                size={24}
                color="red"
              />
            </TouchableOpacity>
          </View>

          <RegistrationTile
            heading={"Register a restaurant"}
            desc={
              "Join our community and showcase your culinary delights to a wider audience."
            }
          />

          <View
            style={{
              height: 140,
              backgroundColor: COLORS.lightWhite,
              margin: 10,
              borderRadius: 12,
            }}
          >
            <ProfileTile
              title={"Orders"}
              icon={"fast-food-outline"}
              font={1}
              onPress={() => {
                navigation.navigate("fetch_orders");
              }}
            />
            <ProfileTile
              title={"Places"}
              icon={"heart"}
              font={2}
              onPress={() => {
                // navigation.navigate("verification_page");
              }}
            />
            <ProfileTile
              title={"Payment History"}
              icon={"creditcard"}
              onPress={() => {
                // navigation.navigate("otp-screen");
              }}
            />
          </View>
          {/*
          <View
            style={{
              height: 140,
              backgroundColor: COLORS.lightWhite,
              margin: 10,
              borderRadius: 12,
            }}
          >
            <ProfileTile title={"Coupons"} icon={"tago"} />
            <ProfileTile title={"My Store"} icon={"bag"} font={2} />
            <ProfileTile title={"History"} icon={"globe-outline"} font={1} />
          </View>
*/}
          <RegistrationTile
            heading={"Join the courier team"}
            desc={
              "Embark on a journey, deliver joy, and earn on your own schedule."
            }
          />

          <View
            style={{
              height: 140,
              backgroundColor: COLORS.lightWhite,
              margin: 10,
              borderRadius: 12,
            }}
          >
            <ProfileTile
              title={"Shipping Address"}
              icon={"location-outline"}
              font={1}
              onPress={() => {
                navigation.navigate("shipping-address");
              }}
            />
            <ProfileTile title={"Services Center"} icon={"customerservice"} />
            <ProfileTile title={"Settings"} icon={"setting"} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  text: {
    marginLeft: 10,
    fontFamily: "medium",
    color: COLORS.black,
  },
  email: {
    marginLeft: 10,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 60,
  },
});
