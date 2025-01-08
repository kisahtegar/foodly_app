import { useState, useEffect } from "react";
import axios from "axios";
import { BaseUrl } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchNearByRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState([106.5817625, -6.1885115]);

  const fetchData = async () => {
    setIsLoading(true);

    const lat = await AsyncStorage.getItem("latitude");
    const lng = await AsyncStorage.getItem("longitude");
    const defLat = await AsyncStorage.getItem("defaultLat");
    const defLng = await AsyncStorage.getItem("defaultLng");

    console.log("[fetchNearByRestaurants.js:fetchData] lat & lng:", lat, lng);

    try {
      let response;
      if (lat === null && lng === null) {
        if (defLat === null && defLng === null) {
          response = await axios.get(
            `${BaseUrl}/api/restaurant/nearby?lat=${coords[1]}&lng=${coords[0]}`
          );
        } else {
          response = await axios.get(
            `${BaseUrl}/api/restaurant/nearby?lat=${defLat}&lng=${defLat}`
          );
        }
      } else {
        response = await axios.get(
          `${BaseUrl}/api/restaurant/nearby?lat=${lat}&lng=${lng}`
        );
      }

      setRestaurants(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { restaurants, isLoading, error, refetch };
};

export default fetchNearByRestaurants;
