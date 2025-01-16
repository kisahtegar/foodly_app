import React from "react";
import { Marker } from "react-native-maps";

const PlaceMarker = ({ item }) => {
  return (
    <Marker
      title={item.name}
      coordinate={{
        latitude: item.latitude,
        longitude: item.longitude,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0421,
      }}
    />
  );
};

export default PlaceMarker;
