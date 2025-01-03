import * as Location from "expo-location";

const reverseGeocode = async function (latitude, longitude) {
  console.log(" my lat1 and lng2 ", latitude, longitude);
  const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
    longitude: longitude,
    latitude: latitude,
  });
  return reverseGeocodedAddress[0];
  // the below uses user default location from the simulator
  // setAddress(reverseGeocodedAddress[0]);
  // setLocation(reverseGeocodedAddress[0]);
};

exports = { reverseGeocode };
