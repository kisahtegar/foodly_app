import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "../constants/theme";

const fetchCartCount = () => {
  const [cartCount, setCartCount] = useState(null);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    setIsCartLoading(true);

    try {
      const response = await axios.get(`${BaseUrl}/api/cart/count`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCartCount(response.data.cartCount);
      setIsCartLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsCartLoading(true);
    fetchData();
  };

  return { cartCount, isCartLoading, error, refetch };
};

export default fetchCartCount;
