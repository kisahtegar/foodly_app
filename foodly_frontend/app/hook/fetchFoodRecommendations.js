import axios from "axios";
import { useState, useEffect } from "react";
import { BaseUrl } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchFoodRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState([106.5817625, -6.1885115]);

  const fetchData = async () => {
    setIsLoading(true);

    const lat = await AsyncStorage.getItem("latitude");
    const lng = await AsyncStorage.getItem("longitude");
    const defLat = await AsyncStorage.getItem("defaultLat");
    const defLng = await AsyncStorage.getItem("defaultLng");

    try {
      let response;
      if (lat === null && lng === null) {
        if (defLat === null && defLng === null) {
          response = await axios.get(
            `${BaseUrl}/api/foods/nearby?lat=${coords[1]}&lng=${coords[0]}`
          );
        } else {
          response = await axios.get(
            `${BaseUrl}/api/foods/nearby?lat=${defLat}&lng=${defLat}`
          );
        }
      } else {
        response = await axios.get(
          `${BaseUrl}/api/foods/nearby?lat=${lat}&lng=${lng}`
        );
      }

      setRecommendations(response.data);
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

  return { recommendations, isLoading, error, refetch };
};

export default fetchFoodRecommendations;
