import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "../constants/theme";

const fetchDefaultAddress = () => {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    setIsLoading(true);

    try {
      const response = await axios.get(`${BaseUrl}/api/address/default`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setDefaultAddress(response.data);
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

  return { defaultAddress, isLoading, error, refetch };
};

export default fetchDefaultAddress;
