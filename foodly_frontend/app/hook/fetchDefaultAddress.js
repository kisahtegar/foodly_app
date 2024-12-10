import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchDefaultAddress = () => {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://192.168.0.17:6002/api/address/default`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
    setDefaultAddress(true);
    fetchData();
  };

  return { defaultAddress, isLoading, error, refetch };
};

export default fetchDefaultAddress;
