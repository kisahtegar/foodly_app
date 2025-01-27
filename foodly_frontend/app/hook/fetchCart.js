import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";

const fetchCart = () => {
  const [cartList, setCartList] = useState(null);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    setIsCartLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCartList(response.data.cart);
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

  const refetch = async () => {
    setIsCartLoading(true);
    await fetchData();
  };

  return { cartList, isCartLoading, error, refetch };
};

export default fetchCart;
