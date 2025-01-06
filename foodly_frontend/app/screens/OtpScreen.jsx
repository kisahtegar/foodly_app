import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from "react-native";
import React, { useRef, useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { CountryPicker } from "react-native-country-codes-picker";
import { COLORS } from "../constants/theme";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth"; // Firebase imports

const bkImg =
  "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734400159/images/randoms/ads-on-internet.png";

export default function OtpScreen() {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("+62");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);
  const phone = countryCode + phoneNumber;

  // Send verification code
  const sendVerification = async () => {
    try {
      console.log("[OtpScreen.sendVerification]: Sending verification code...");
      const phoneProvider = new PhoneAuthProvider(auth); // Using PhoneAuthProvider from Firebase
      const verificationId = await phoneProvider.verifyPhoneNumber(phone, null); // No recaptcha verifier for now
      setVerificationId(verificationId); // Set verification ID
      console.log(
        "[OtpScreen.sendVerification]: verificationId = ",
        verificationId
      );
    } catch (error) {
      console.error("[OtpScreen.sendVerification]: error = ", error);
      Alert.alert("Error", "Failed to send verification code.");
    }
  };

  const sendVerifications = () => {
    try {
      console.log("[OtpScreen.sendVerification]: Try sending verification...");
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber(phone, recaptchaVerifier.current)
        .then(setVerificationId);

      console.log(
        "[OtpScreen.sendVerification]: verificationId = ",
        verificationId
      );
      console.log(
        "[OtpScreen.sendVerification]: phoneProvider = ",
        phoneProvider
      );
    } catch (error) {
      console.log("[OtpScreen.sendVerification]: error = ", error);
    }
  };

  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    console.log(
      "[OtpScreen.sendVerification]: verificationId = ",
      verificationId
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setCode("");
        setPhoneNumber("");
      })
      .catch((error) => {
        alert(error);
      });

    Alert.alert("Login successful. Welcome to Foodly");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {/* <Image
        source={{
          uri: bkImg,
        }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={0}
      /> */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      <Text style={styles.otpText}>Verify Your Phone Number</Text>

      <Text
        style={{
          fontSize: "regular",
          fontSize: 12,
          color: COLORS.gray,
          textAlign: "justify",
          margin: 12,
          marginBottom: 20,
        }}
      >
        By pressing send code, we will send a code to your phone number to
        verify your phone number.
      </Text>

      <View style={{ alignItems: "center" }}>
        <CountryPicker
          initialState="US"
          show={show}
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setShow(false);
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={{
                paddingHorizontal: 25,
                height: 41.3,
                borderTopLeftRadius: 9,
                borderBottomLeftRadius: 9,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                }}
              >
                {countryCode}
              </Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Phone Number "
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoCompleteType="tel"
              style={styles.textInput}
            />
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                height: 41.3,
                borderTopRightRadius: 9,
                borderBottomRightRadius: 9,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
              }}
              onPress={sendVerification}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 50 }} />

        <OtpInput
          numberOfDigits={6}
          focusColor={COLORS.primary}
          focusStickBlinkingDuration={500}
          onTextChange={(code) => {
            // setCode(code);
          }}
          onFilled={(code) => setCode(code)}
          theme={{
            containerStyle: { margin: 12 },
            inputsContainerStyle: styles.inputsContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />

        <View style={{ marginBottom: 50 }} />

        <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
          <Text style={styles.buttonText}>Confirm Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  otpText: {
    fontSize: 25,
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
    backgroundColor: COLORS.primary,
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
    borderColor: "#9b59b6",
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  underlineStyleHighLighted: {
    borderColor: "#000",
  },
});
