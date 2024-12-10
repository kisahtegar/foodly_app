import { useState, useEffect } from "react";
import axios from "axios";

const fetchFoodByRest = (restaurantId, code) => {
  const [foodList, setFoodList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://192.168.0.17:6002/api/foods/restaurant/${restaurantId}`
      );
      setFoodList(response.data);

      if (response.data.length === 0) {
        const response = await axios.get(
          `http://192.168.0.17:6002/api/foods/recommendation/${code}`
        );
        setFoodList(response.data);
      }
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

  return { foodList, isLoading, error, refetch };
};

export default fetchFoodByRest;
