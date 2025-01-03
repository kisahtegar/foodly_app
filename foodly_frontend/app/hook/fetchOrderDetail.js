import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import GoogleApiServices from "./GoogleApiServices";

const fetchOrderDetail = (restaurantLng, restaurantLat) => {
  const [loading, setLoader] = useState(false);
  const [distanceTime, setDistanceTime] = useState({});

  const fetchData = async () => {
    setLoader(true);
    const userLat = await AsyncStorage.getItem("latitude");
    const userLng = await AsyncStorage.getItem("longitude");

    GoogleApiServices.calculateDistanceAndTime(
      userLat,
      userLng,
      restaurantLat,
      restaurantLng
    ).then((result) => {
      if (result) {
        setDistanceTime(result);
        setLoader(false);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setLoader(true);
    fetchData();
  };

  return { loading, distanceTime, refetch };
};

export default fetchOrderDetail;
