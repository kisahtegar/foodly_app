import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchProfile = () => {
  const [user, setUser] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    setIsProfileLoading(true);

    try {
      const response = await axios.get(`http://192.168.0.17:6002/api/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data);
      setIsProfileLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsProfileLoading(true);
    fetchData();
  };

  return { user, isProfileLoading, error, refetch };
};

export default fetchProfile;
