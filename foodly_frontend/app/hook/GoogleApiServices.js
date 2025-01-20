import axios from "axios";
import { GOOGLE_API_KEY } from "@env";

/**
 * Calculates the distance, estimated travel time, and cost between two geographic coordinates.
 *
 * This function attempts to retrieve the distance and duration between a start and destination
 * using multiple travel modes (e.g., "bicycling" and "driving") via the Google Distance Matrix API.
 * It calculates the estimated price based on the total distance traveled and a specified rate per kilometer.
 *
 * @param {number} startLat - The latitude of the starting location.
 * @param {number} startLng - The longitude of the starting location.
 * @param {number} destinationLat - The latitude of the destination location.
 * @param {number} destinationLng - The longitude of the destination location.
 * @param {string[]} [modes=["bicycling", "driving"]] - An array of travel modes to try in sequence if a result is not found.
 *     Common options include "driving", "bicycling", "walking", and "transit".
 *     The function will attempt each mode in order until a valid result is returned.
 * @param {number} [ratePerKm=15000] - The cost rate per kilometer, used to calculate the estimated travel price.
 *
 * @returns {Promise<{distance: string, duration: string, finalPrice: string, mode: string} | null>}
 *     An object containing:
 *       - `distance`: The distance between the locations in text format (e.g., "5 km").
 *       - `duration`: The estimated travel time in text format (e.g., "15 mins").
 *       - `finalPrice`: The estimated travel cost based on the distance.
 *       - `mode`: The mode of travel that provided the result (e.g., "bicycling" or "driving").
 *     Returns `null` if no valid result is found for any mode.
 *
 * @throws Will log an error message if the API request fails for any reason, and the function will continue to the next mode if available.
 *
 * @example
 * calculateDistanceAndTime(
 *   -6.209467, 106.528836,  // Start location (e.g., Jakarta)
 *   -6.155549, 106.547669,  // Destination location (nearby point)
 * ).then(result => {
 *   if (result) {
 *     console.log(`Distance: ${result.distance}, Duration: ${result.duration}, Price: ${result.finalPrice}`);
 *   } else {
 *     console.log("No valid results found for any mode.");
 *   }
 * });
 */
const calculateDistanceAndTime = async (
  startLat,
  startLng,
  destinationLat,
  destinationLng,
  modes = ["TWO_WHEELER"],
  ratePerKm = 1800
) => {
  const baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  // Loop through each travel mode until a valid result is returned
  for (const mode of modes) {
    const requestUrl = `${baseUrl}?origins=${startLat},${startLng}&destinations=${destinationLat},${destinationLng}&mode=${mode}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(requestUrl);
      const data = await response.json();

      // Log the mode and response for debugging
      // console.log(`Trying mode: ${mode}, Response Data:`, data);

      // Check if the API response was successful and contains valid data
      if (data.status === "OK" && data.rows[0]?.elements[0]?.status === "OK") {
        const distance = data.rows[0].elements[0].distance.text;
        const duration = data.rows[0].elements[0].duration.text;

        // Convert distance to kilometers and calculate estimated price
        const distanceInKm = parseFloat(distance.replace(/[^\d.-]/g, ""));
        const finalPrice = `Rp. ${(distanceInKm * ratePerKm).toFixed(2)}`;

        return {
          distance,
          duration,
          finalPrice,
          mode, // Return the travel mode that gave a successful result
        };
      } else {
        // Log a warning if this mode did not return a valid result
        console.warn(`No results for mode ${mode}. Trying next mode.`);
      }
    } catch (error) {
      // Log an error if the request fails for any mode
      console.error(
        `Failed to calculate distance and duration in mode ${mode}:`,
        error
      );
    }
  }

  // Log an error if no valid result was found after trying all modes
  console.error("No valid results for any mode.");
  return null;
};

/**
 * Extracts all numbers from a given string.
 *
 * This function takes an input string and extracts all the sequences of digits from it,
 * returning an array of integers. If the input is not a string, it returns an empty array.
 *
 * @param {string} inputStr - The string from which numbers will be extracted.
 * @returns {number[]} - An array of integers representing the numbers found in the input string.
 *                        If no numbers are found or if the input is not a string, returns an empty array.
 *
 * @example
 * // Example 1: Extract numbers from a string containing digits
 * extractNumbers("The cost is 100 dollars and 50 cents.");
 * // Returns: [100, 50]
 */
const extractNumbers = (inputStr) => {
  if (typeof inputStr !== "string") {
    return [];
  }
  const matched = inputStr.match(/\d+/g);
  return matched ? matched.map((num) => parseInt(num, 10)) : [];
};

/**
 * Decodes an encoded polyline into an array of geographical points.
 *
 * This function decodes a Google Maps encoded polyline string into an array of latitude and longitude
 * coordinates. The polyline encoding format is used to represent a series of geographical points in a compact
 * way, and this function reverses that encoding to get the actual points.
 *
 * @param {string} encoded - The encoded polyline string that needs to be decoded.
 * @returns {Object[]} - An array of objects, where each object contains the latitude and longitude of a decoded point.
 *                        The latitude and longitude are represented as floating-point numbers with 5 decimal precision.
 *
 * @example
 * // Example of using the decode function
 * const encodedPolyline = "_p~iF~ps|U_ulLnnqC_mqFwCwD";
 * const decodedPoints = decode(encodedPolyline);
 * console.log(decodedPoints);
 * // Returns:
 * // [
 * //   { latitude: 38.5, longitude: -120.2 },
 * //   { latitude: 40.7, longitude: -120.95 },
 * //   { latitude: 43.252, longitude: -126.453 },
 * // ]
 */
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

export default {
  calculateDistanceAndTime,
  extractNumbers,
  decode,
};
