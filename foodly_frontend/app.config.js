import "dotenv/config";

export default {
  expo: {
    name: "Foodly App",
    slug: "foodly-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    extra: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "726fb1b4-92ed-47e8-aef2-7b9291e950b8",
      },
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kisahcode.foodly",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        package: "com.kisahcode.foodly",
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.VIBRATE",
        "android.permission.POST_NOTIFICATIONS",
      ],
      package: "com.kisahcode.expofire",
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
      config: {
        firebase: {
          apiKey: "AIzaSyDtv_57pGQwkSFOwGijH4fR0uxNerU-dHY",
          authDomain: "kisahdemo.firebaseapp.com",
          databaseURL:
            "https://kisahdemo-default-rtdb.asia-southeast1.firebasedatabase.app",
          projectId: "kisahdemo",
          storageBucket: "kisahdemo.firebasestorage.app",
          messagingSenderId: "695798125068",
          appId: "1:695798125068:web:0dbf24c5b367ee21135429",
          measurementId: "G-7T7QEQPHRH",
        },
      },
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
    ],
  },
};
