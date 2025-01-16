import { StyleSheet, View, Image, FlatList } from "react-native";
import React from "react";
import OrderTile from "../components/OrderTile";
import { useNavigation } from "@react-navigation/native";
import fetchOrders from "../hook/fetchOrders";
import LoadingScreen from "../components/LoadingScreen";

const bkImg =
  "https://res.cloudinary.com/dc7i32d3v/image/upload/v1734400159/images/randoms/ads-on-internets.png";

const FetchOrders = () => {
  const navigation = useNavigation();
  const { data, loading, error, refetch } = fetchOrders();

  if (loading) {
    return <LoadingScreen />;
  }

  const renderItem = (item) => {
    return (
      <OrderTile
        item={item}
        onPress={() => navigation.navigate("fetch_order_detail", item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* <Image
        source={{ uri: bkImg }}
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: 0.7,
          },
        ]}
      /> */}

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        style={{ marginTop: 12, marginRight: 12 }}
      />
    </View>
  );
};

export default FetchOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  suspendedButtonContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
});
