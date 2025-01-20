import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";
import { RestaurantContext } from "../context/RestaurantContext";

const fetchRating = () => {
  const [data, setData] = useState([]);
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const { restaurantObj, setRestaurant } = useContext(RestaurantContext);

  const fetchData = async () => {
    setLoader(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/rating?restaurantId=${restaurantObj._id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      console.log("[hook.fetchRating]: Rating data ", response.data);
      setData(response.data);
      setLoader(false);
    } catch (error) {
      setError(error);
      console.log("rating error ", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setLoader(true);
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default fetchRating;
