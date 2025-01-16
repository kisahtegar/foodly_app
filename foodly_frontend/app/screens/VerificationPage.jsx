import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { BaseUrl, COLORS } from "../constants/theme";
import BackBtn from "../components/BackBtn";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const bkImg =
  "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734400159/images/randoms/ads-on-internet.png";

const VerificationPage = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyAccount = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);

    setLoading(true);

    try {
      console.log(accessToken);

      const response = await axios.get(`${BaseUrl}/api/user/verify/${code}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        await AsyncStorage.setItem(
          "verification",
          JSON.stringify(response.data.verified)
        );
        navigation.navigate("bottom-navigation");
        setLoading(false);
      } else {
        setError(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    getEmail();
  }, []);

  const getEmail = async () => {
    const data = await AsyncStorage.getItem("email");
    setData(JSON.parse(data));
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackBtn top={60} onPress={() => navigation.goBack()} />

      {/* <Image
        source={{ uri: bkImg }}
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: 0.7,
          },
        ]}
      /> */}

      <Text style={styles.otpText}>Verify Your Account</Text>

      <Text
        style={{
          fontSize: "regular",
          fontSize: 12,
          color: COLORS.gray,
          textAlign: "justify",
          margin: 12,
        }}
      >
        The email has been sent to {data}. If the email is correct, please
        delete this account and create a new one with the correct email.
        Alternatively, you can logout and browser the app without an account.
      </Text>

      <View style={{ alignItems: "center" }}>
        <OtpInput
          numberOfDigits={6}
          focusColor={COLORS.primary}
          focusStickBlinkingDuration={500}
          onTextChange={(code) => {
            // setCode(code);
          }}
          onFilled={(code) => setCode(code)}
          theme={{
            containerStyle: { margin: 10 },
            inputsContainerStyle: styles.inputsContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />

        <TouchableOpacity
          style={styles.sendCode}
          onPress={() => {
            verifyAccount(code, setLoading, setError, setData);
          }}
        >
          {loading === true ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Confirm Code</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerificationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.offwhite,
  },
  otpText: {
    fontSize: 30,
    color: COLORS.primary,
    fontWeight: "bold",
    margin: 10,
  },
  textInput: {
    padding: 5,
    width: 240,
    paddingHorizontal: 20,
    fontSize: 24,
    textAlign: "center",
    color: "#000",
  },
  sendVerification: {
    backgroundColor: "#3498db",
    padding: 20,
    borderRadius: 10,
  },
  sendCode: {
    padding: 14,
    width: "95%",
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: COLORS.primary,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    color: COLORS.secondary,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  underlineStyleHighLighted: {
    borderColor: COLORS.primary,
  },
});
