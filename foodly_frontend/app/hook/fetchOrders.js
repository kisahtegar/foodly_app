import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "@env";

const fetchOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoader(true);
    const token = await AsyncStorage.getItem("token");
    try {
      //const endpoint = await axios.get(`${BASE_URL}/api/address/all`;

      const headers = {
        "Content-Type": "application/json",
        token: "Bearer " + JSON.parse(token),
      };

      const response = await axios.get(`${BASE_URL}/api/orders/userOrders`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      //Here we get 500, 401 and 403
      //500 due to route issues which should be at the top
      //401 due to wrong parameter like Auhorization is missing
      //403 due to did not parse asyncstorage value to json
      console.log(
        "[hook.fetchOrders]: response.data.data = ",
        response.data.data
      );
      setData(response.data.data);

      setLoader(false);
    } catch (error) {
      setError(error);
      console.log("[hook.fetchOrders]: error = ", error);
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

export default fetchOrders;
