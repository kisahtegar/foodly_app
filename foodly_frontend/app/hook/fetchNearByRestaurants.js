import { useState, useEffect } from "react";
import axios from "axios";
import { BaseUrl } from "../constants/theme";

const fetchNearByRestaurants = (code) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${BaseUrl}/api/restaurant/${code}`);

      setRestaurants(response.data);
      console.log("[hook.fetchNearByRestaurants]: restaurants = ", restaurants);
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
