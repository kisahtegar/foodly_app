import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@env";

const fetchRandomRestaurants = (code) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/api/restaurant/${code}`);

      setRestaurants(response.data);
      console.log("[hook.fetchRandomRestaurants]: restaurants = ", restaurants);
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

export default fetchRandomRestaurants;
