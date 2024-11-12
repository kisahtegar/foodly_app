import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { UserLocationContext } from "../context/UserLocationContext";
import { COLORS, SIZES } from "../constants/theme";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import GoogleApiServices from "../hook/GoogleApiServices";
import PlaceMarker from "./PlaceMarker";

const GoogleMapView = ({ placeList }) => {
  const [directions, setDirections] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const { location, setLocation } = useContext(UserLocationContext);
  const [mapRegion, setMapRegion] = useState({
    latitude: -0.789275,
    longitude: 113.921326,
    latitudeDelta: 0.0522,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    39.68884;
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.01,
      });

      fetchDirections(
        placeList[0].latitude,
        placeList[0].longitude,
        location.coords.latitude,
        location.coords.longitude
      );
    }
  }, [location, coordinates]);

  const fetchDirections = async (
    startLat,
    startLng,
    destinationLat,
    destinationLng
  ) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${destinationLat},${destinationLng}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json().then((data) => {
        setDirections(data);
        const encodedPolyline = data.routes[0].overview_polyline.points;
        const coordinates = GoogleApiServices.decode(encodedPolyline);

        setCoordinates(coordinates);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={mapRegion}
      >
        <Marker title="My Location" coordinate={mapRegion} />

        {placeList.map(
          (item, index) => index <= 1 && <PlaceMarker coordinates={item} />
        )}

        <Polyline
          coordinates={coordinates}
          strokeColor={COLORS.primary}
          strokeWidth={5}
        />
      </MapView>
    </View>
  );
};

export default GoogleMapView;

const styles = StyleSheet.create({
  mapContainer: {
    width: SIZES.width,
    height: SIZES.height / 2.6,
    borderColor: COLORS.gray2,
    borderWidth: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});
