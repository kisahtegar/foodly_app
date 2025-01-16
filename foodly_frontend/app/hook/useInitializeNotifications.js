import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useInitializeNotifications = () => {
  const [notificationToken, setNotificationToken] = useState(null);
  const [isNotificationInitialized, setIsNotificationInitialized] =
    useState(false);
  const [notificationError, setNotificationError] = useState(null);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        if (Platform.OS === "android") {
          // Set up the notification channel for Android
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        if (Device.isDevice) {
          // Check and request notification permissions
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          if (finalStatus !== "granted") {
            throw new Error("Notification permissions not granted");
          }

          // Get the push token
          const pushToken = (
            await Notifications.getExpoPushTokenAsync({
              projectId: Constants?.expoConfig?.extra?.eas?.projectId,
            })
          ).data;

          setNotificationToken(pushToken);

          // Check if token is already stored
          const storedToken = await AsyncStorage.getItem("fcm");

          if (storedToken !== JSON.stringify(pushToken)) {
            // Update AsyncStorage
            await AsyncStorage.setItem("fcm", JSON.stringify(pushToken));

            // Optionally, send token to your server
            // console.log(
            //   "[useInitializeNotifications]: Token updated and saved to AsyncStorage."
            // );
          } else {
            // console.log(
            //   "[useInitializeNotifications]: Token is already up to date."
            // );
          }
        } else {
          throw new Error("Must use a physical device for push notifications");
        }

        setIsNotificationInitialized(true);
      } catch (err) {
        setNotificationError(
          err.message || "Failed to initialize notifications"
        );
        setIsNotificationInitialized(false);
      }
    };

    initializeNotifications();
  }, []); // Run only once

  return { notificationToken, isNotificationInitialized, notificationError };
};
