import { StyleSheet, View, FlatList } from "react-native";
import React, { useCallback } from "react";
import AddressTile from "../components/AddressTile";
import Button from "../components/Button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import fetchAddresses from "../hook/fetchAddresses";
import LoadingScreen from "../components/LoadingScreen";

const ShippingAddress = () => {
  const navigation = useNavigation();
  const { addresses, isLoading, error, refetch } = fetchAddresses();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderItem = (item) => {
    return (
      <AddressTile
        item={item}
        onPress={() => navigation.navigate("default_add", item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        style={{ marginTop: 12, marginRight: 12 }}
      />

      <View style={styles.suspendedButtonContainer}>
        <Button
          isValid={true}
          title="Add Address"
          radius={30}
          onPress={() => navigation.navigate("add-address")}
        />
      </View>
    </View>
  );
};

export default ShippingAddress;

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
