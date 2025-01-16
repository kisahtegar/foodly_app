import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { COLORS, SIZES } from "../constants/theme";
import { UserLocationContext } from "../context/UserLocationContext";
import PlaceMarker from "./PlaceMarker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState, useRef } from "react";
import { GoogleApiKey } from "../constants/theme";

const GoogleMapsView = ({ placeList }) => {
  const [directions, setDirections] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [apiCaller, setApiCaller] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: -0.789275,
    longitude: 113.921326,
    latitudeDelta: 0.0522,
    longitudeDelta: 0.0421,
  });

  const { location, setLocation } = useContext(UserLocationContext);
  const mapRef = useRef(null); // Add MapView ref

  const fetchDirections = async (
    startLat,
    startLng,
    destinationLat,
    destinationLng
  ) => {
    try {
      const lat = await AsyncStorage.getItem("latitude");
      const lng = await AsyncStorage.getItem("longitude");
      if (lat !== null && lng !== null) {
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lng));
      }
      console.log(
        "[GoogleMapsView.fetchDirections]: Calling with orgin lat and lng ",
        lat,
        lng
      );
      console.log(
        "[GoogleMapsView.fetchDirections]: Calling with destination lat and lng ",
        destinationLat,
        destinationLng
      );
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lng}&destination=${destinationLat},${destinationLng}&key=${GoogleApiKey}`;
      const response = await fetch(url);
      console.log("calling with lat and lng ", lat, lng);
      const data = await response.json().then((data) => {
        setDirections(data);
        const encodedPolyline = data.routes[0].overview_polyline.points;
        const coordinates = decode(encodedPolyline);
        setCoordinates(coordinates);
        setApiCaller(true);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        const lat = await AsyncStorage.getItem("latitude");
        const lng = await AsyncStorage.getItem("longitude");

        // If the values exist, update the state
        if (lat !== null && lng !== null) {
          setLatitude(parseFloat(lat)); // Store latitude in state
          setLongitude(parseFloat(lng)); // Store longitude in state
          console.log(
            "[GoogleMapsView]: Latitude and Longitude retrieved from AsyncStorage"
          );
        }
      } catch (error) {
        console.error(
          "[GoogleMapsView]: Error retrieving location from AsyncStorage:",
          error
        );
      }
    };

    getLocation();

    // Ensure latitude and longitude from AsyncStorage are valid
    if (latitude && longitude && placeList.length > 0) {
      // Fetch directions if location is available
      fetchDirections(
        latitude, // Use latitude from state
        longitude, // Use longitude from state
        placeList[0].latitude, // Use placeList latitude
        placeList[0].longitude // Use placeList longitude
      );

      // Set map region
      setMapRegion({
        latitude: latitude, // Use latitude from state
        longitude: longitude, // Use longitude from state
        latitudeDelta: 0.034,
        longitudeDelta: 0.01,
      });

      // Fit both user location and the first place in the map view
      const bounds = [
        { latitude: latitude, longitude: longitude }, // Use latitude and longitude from state
        { latitude: placeList[0].latitude, longitude: placeList[0].longitude }, // First place
      ];

      mapRef.current.fitToCoordinates(bounds, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });

      console.log("Polyline Coordinates: ", coordinates);
    }
  }, [latitude, longitude, placeList]); // Make sure to include `latitude` and `longitude` in dependencies

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Attach ref here
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={mapRegion}
      >
        <Marker title="My Location" coordinate={mapRegion} />

        {placeList.map(
          (item, index) => index <= 1 && <PlaceMarker key={index} item={item} />
        )}

        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeWidth={6}
            strokeColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};
export default GoogleMapsView;

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

/*
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={mapRegion}
      >
        <Marker title="My Location" coordinate={mapRegion} />

        {placeList.map(
          (item, index) => index <= 1 && <PlaceMarker item={item} />
        )}

        <Polyline
          coordinates={coordinates}
          strokeWidth={6}
          strokeColor={COLORS.secondary}
        />
      </MapView>
    </View>
  );
};

export default GoogleMapsView;
*/
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: SIZES.width - 20,
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});
