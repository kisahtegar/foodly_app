import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import GoogleMapsView from "../../components/GoogleMapsView";
import { COLORS, SIZES } from "../../constants/theme";
import { RestaurantContext } from "../../context/RestaurantContext";

const Pickup = () => {
  /* if(restaurantObj==undefined)return; */
  const { restaurantObj, setRestaurant } = useContext(RestaurantContext);
  const coords = restaurantObj.coords;

  const onDirectionClick = () => {
    /* if(coords==undefined)return; */
    const url = Platform.select({
      ios: "maps:" + coords.latitude + "," + coords.longitude,
      android: "geo:" + coords.latitude + "," + coords.longitude + "?z=16",
    });
    console.log("[Pickup.url]: url = ", url);
    Linking.openURL(url);
  };

  return (
    <View style={{ backgroundColor: COLORS.lightWhite, height: 600 }}>
      <View style={{ marginHorizontal: 0 }}>
        <GoogleMapsView placeList={[coords]} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            {/* <Text style={styles.title}>Location : </Text> */}
            <Text style={[styles.small, { width: SIZES.width / 1.6 }]}>
              {restaurantObj.coords.address}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              borderColor: COLORS.gray2,
              borderWidth: 0.4,
              height: 45,

              justifyContent: "center",
              borderRadius: 12,
              marginVertical: 8,
            }}
            onPress={() => {
              onDirectionClick();
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "medium",
                paddingHorizontal: 10,
              }}
            >
              🚶🏽‍♂️ Directions
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Pickup;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: "medium",
    marginTop: 15,
  },
  small: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.gray,
  },
});
