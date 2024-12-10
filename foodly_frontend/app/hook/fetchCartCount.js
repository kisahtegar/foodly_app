import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartCountContext } from "../context/CartCountContext";

const fetchCartCount = () => {
  const { cartCount, setCartCount } = useContext(CartCountContext);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    setIsCartLoading(true);

    try {
      const response = await axios.get(
        `http://192.168.0.17:6002/api/cart/count`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
