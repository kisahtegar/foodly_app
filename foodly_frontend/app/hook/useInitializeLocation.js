import { useEffect } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useInitializeLocation({ setLocation, setAddress, setLogin }) {
  useEffect(() => {
    const initializeLocation = async () => {
      const defaultAddress = {
        city: "Serangg",
        country: "Indonesia",
        district: "Cipocok Jaya",
        isoCountryCode: "ID",
        name: "Jl. Raya Cipocok Jaya",
        postalCode: "42100",
        region: "Banten",
        street: "Jl. Raya Cipocok Jaya",
        streetNumber: "15",
        subregion: "Kabupaten Tangerang",
        timezone: "Asia/Jakarta",
      };

      try {
        // Set a default address
        setAddress(defaultAddress);

        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("[useInitializeLocation]: Location permission denied");
          return;
        }

        // Get the current position
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        const { latitude, longitude } = location.coords;

        // Save coordinates to AsyncStorage
        await AsyncStorage.setItem("defaultLat", JSON.stringify(latitude));
        await AsyncStorage.setItem("defaultLng", JSON.stringify(longitude));
        await AsyncStorage.setItem("latitude", JSON.stringify(latitude));
        await AsyncStorage.setItem("longitude", JSON.stringify(longitude));

        console.log(
          "[useInitializeLocation.js:initializeLocation]: Location initialized",
          latitude,
          longitude
        );

        // Reverse geocode to get address
        const reverseGeocoded = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        // Update address state
        if (reverseGeocoded.length > 0) {
          setAddress(reverseGeocoded[0]);
        }

        const userToken = await AsyncStorage.getItem("token");
        setLogin(userToken !== null);
      } catch (error) {
        console.error(
          "[useInitializeLocation]: Error initializing location",
          error
        );
      }
    };

    initializeLocation();
  }, [setLocation, setAddress, setLogin]);
}
