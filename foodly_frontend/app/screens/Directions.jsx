import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "@react-native-maps/mapview";
import Geolocation from "@react-native-community/geolocation";
import { GoogleApiKey } from "../constants/theme";

const AppMap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState([]);

  const coords = {
    latitude: -6.196414, // Approximate latitude for Pasar Kemis
    longitude: 106.533891, // Approximate longitude for Pasar Kemis
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0221,
    address: "Jl. Raya Pasar Kemis, Kabupaten Tangerang, Banten, Indonesia",
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        fetchDirections(latitude, longitude, coords.latitude, coords.longitude);
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const fetchDirections = async (
    startLat,
    startLng,
    destinationLat,
    destinationLng
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${destinationLat},${destinationLng}&key=${GoogleApiKey}`
      );
      const data = await response.json();
      const points = data.routes[0].legs[0].steps.map(
        (step) => step.polyline.points
      );
      const result = [].concat(...points).map((point) => decode(point));
      setDirections(result);
    } catch (error) {
      console.error(error);
    }
  };

  const decode = (encoded) => {
    const points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let shift = 0,
        result = 0;
      let byte;
      do {
        byte = encoded.charCodeAt(index++) - 63; // <-- we use charCodeAt method, not a 'char' property
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: coords.latitudeDelta,
        longitudeDelta: coords.longitudeDelta,
      }}
    >
      <Marker
        coordinate={coords}
        title="Hilton San Francisco"
        description={coords.address}
      />
      {currentLocation && (
        <Marker coordinate={currentLocation} title="Your location" />
      )}
      <Polyline coordinates={directions} strokeWidth={5} strokeColor="blue" />
    </MapView>
  );
};

export default AppMap;
