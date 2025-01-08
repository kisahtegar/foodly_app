import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import React, { useState, useRef, useContext } from "react";
import Button from "../components/Button";
import BackBtn from "../components/BackBtn";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BaseUrl, COLORS, SIZES } from "../constants/theme";
import styles from "./login.style";
import LottieView from "lottie-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../context/LoginContext";
import { UserReversedGeoCode } from "../context/UserReversedGeoCode";
import { CheckLoadRestaurantData } from "../context/CheckRestaurantData";
import { CheckUserAddressType } from "../context/CheckUserAddressType";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 character")
    .required("Required"),
  email: Yup.string()
    .email("Provide a valid email address")
    .required("Required"),
});

const LoginPage = ({ navigation }) => {
  const animation = useRef(null);
  const [loader, setLoader] = useState(false);
  const [obsecureText, setObsecureText] = useState(false);
  const { login, setLogin } = useContext(LoginContext);
  const { address, setAddress } = useContext(UserReversedGeoCode);
  const [defaultad, setDefault] = useState({});
  const { loadRestaurantData, setLoadRestaurantData } = useContext(
    CheckLoadRestaurantData
  );
  const { checkUserAddressType, setCheckUserAddressType } =
    useContext(CheckUserAddressType);

  const inValidForm = () => {
    Alert.alert("Invalid Form", "Please provide all required fields", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Continue",
        onPress: () => {},
      },
      { defaultIndex: 1 },
    ]);
  };

  const getDefaultAddress = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);

    try {
      const response = await axios.get(`${BaseUrl}/api/address/default`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        if (response.data === null) {
          let defLat = await AsyncStorage.getItem("defaultLat");
          let defLng = await AsyncStorage.getItem("defaultLng");
          if (defLat === null || defLng === null) {
            defLat = 37.4219983;
            defLng = -122.084;
            console.log(
              "[LoginPage.getDefaultAddress]: Using hard coded lat and lng"
            );
          }
          await AsyncStorage.setItem("latitude", defLat.toString());
          await AsyncStorage.setItem("longitude", defLng.toString());
          console.log(
            "[LoginPage.getDefaultAddress]: Using hard coded lat and lng = ",
            defLat,
            defLng
          );
          const rgc = await Location.reverseGeocodeAsync({
            longitude: defLng,
            latitude: defLat,
          });
          setAddress(rgc[0]);
        } else {
          setAddress(response.data);
          setDefault(response.data);

          console.log(
            "[LoginPage.getDefaultAddress]: Real data address",
            response.status
          );
          // await reverseGeocode(defaultad.latitude, defaultad.longitude);
          await AsyncStorage.setItem(
            "latitude",
            JSON.stringify(response.data.latitude)
          );
          await AsyncStorage.setItem(
            "longitude",
            JSON.stringify(response.data.longitude)
          );
          console.log("[LoginPage.getDefaultAddress]: Using real lat and lng");
        }

        console.log(
          "[LoginPage.getDefaultAddress]: Using defaultlad ",
          JSON.stringify(defaultad)
        );
        setLoadRestaurantData(true);
        setCheckUserAddressType(true);
      } else if (response.status === 404) {
        Toast.show({
          text1: "Alamat Pengguna",
          text2: "Tidak ada default alamat pengiriman.",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 16, color: "red" },
        });
        navigation.navigate("shipping-address");
      } else {
        console.log(
          "[LoginPage.getDefaultAddress]: Could not get user address from LoginPage = ",
          response.status
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Toast.show({
          text1: "Alamat Pengguna",
          text2: "Tidak ada default alamat pengiriman.",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 16, color: "red" },
        });
        navigation.navigate("shipping-address");
      } else {
        console.error("[LoginPage.getDefaultAddress]: Error = ", error.message);
      }
    }
  };

  const loginFunc = async (values) => {
    setLoader(true);

    try {
      const endpoint = `${BaseUrl}/api/auth/login`;
      const data = values;

      const response = await axios.post(endpoint, data);
      if (response.status === 200) {
        setLoader(false);
        setLogin(true);

        console.log("[LoginPage.loginFunc]: response.data = ", response.data);

        await AsyncStorage.setItem("id", JSON.stringify(response.data._id));
        await AsyncStorage.setItem(
          "token",
          JSON.stringify(response.data.userToken)
        );
        await AsyncStorage.setItem(
          "verification",
          JSON.stringify(response.data.verified)
        );
        await AsyncStorage.setItem(
          "email",
          JSON.stringify(response.data.email)
        );

        await AsyncStorage.setItem("user", JSON.stringify(response.data));

        if (response.data.verified === false) {
          navigation.navigate("verification_page");
        } else {
          getDefaultAddress();
          navigation.navigate("bottom-navigation");
        }
      } else {
        setLogin(false);

        Alert.alert("Error Logging in ", "Please provide valid credentials ", [
          {
            text: "Cancel",
            onPress: () => {},
          },
          {
            text: "Continue",
            onPress: () => {},
          },
          { defaultIndex: 1 },
        ]);
      }
    } catch (error) {
      setLogin(false);
      Alert.alert("Error ", "Oops, " + error.message, [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Continue",
          onPress: () => {},
        },
        { defaultIndex: 1 },
      ]);
    } finally {
      setLoader(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.white }}>
      <View style={{ marginHorizontal: 20, marginTop: 50 }}>
        <BackBtn onPress={() => navigation.goBack()} />
        <LottieView
          autoPlay
          ref={animation}
          style={{ width: "100%", height: SIZES.height / 3.2 }}
          source={require("../../assets/anime/delivery.json")}
        />

        <Text style={styles.titleLogin}>Foodly Family</Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => loginFunc(values)}
        >
          {({
            handleChange,
            handleBlur,
            touched,
            handleSubmit,
            values,
            errors,
            isValid,
            setFieldTouched,
          }) => (
            <View>
              <View style={styles.wrapper}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={styles.inputWrapper(
                    touched.email ? COLORS.secondary : COLORS.offwhite
                  )}
                >
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />

                  <TextInput
                    placeholder="Enter email"
                    onFocus={() => {
                      setFieldTouched("email");
                    }}
                    onBlur={() => {
                      setFieldTouched("email", "");
                    }}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1 }}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorMessage}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.wrapper}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={styles.inputWrapper(
                    touched.password ? COLORS.secondary : COLORS.offwhite
                  )}
                >
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />

                  <TextInput
                    secureTextEntry={obsecureText}
                    placeholder="Password"
                    onFocus={() => {
                      setFieldTouched("password");
                    }}
                    onBlur={() => {
                      setFieldTouched("password", "");
                    }}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1 }}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setObsecureText(!obsecureText);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={obsecureText ? "eye-outline" : "eye-off-outline"}
                      size={18}
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                )}
              </View>

              <Button
                loader={loader}
                title={"L O G I N"}
                onPress={isValid ? handleSubmit : inValidForm}
                isValid={isValid}
              />

              <Text
                style={styles.registration}
                onPress={() => {
                  navigation.navigate("signUp");
                }}
              >
                {" "}
                Register{" "}
              </Text>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default LoginPage;
