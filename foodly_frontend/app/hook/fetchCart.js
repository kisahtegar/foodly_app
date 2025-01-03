import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "../constants/theme";

const fetchCart = () => {
  const [cartList, setCartList] = useState(null);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    setIsCartLoading(true);

    try {
      const response = await axios.get(
        `${BaseUrl}/api/cart/653168e9f94c6496dc84f3bf`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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

  const refetch = () => {
    setIsCartLoading(true);
    fetchData();
  };

  return { cartList, isCartLoading, error, refetch };
};

export default fetchCart;
