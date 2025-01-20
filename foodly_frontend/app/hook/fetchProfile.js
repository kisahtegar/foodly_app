import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";

const fetchProfile = () => {
  const [user, setUser] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    setIsProfileLoading(true);
    const userInfo = await AsyncStorage.getItem("user");
    setUser(JSON.parse(userInfo));
    setIsProfileLoading(false);
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
