import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import NetworkImage from "../../components/NetworkImage";
import { COLORS, SIZES } from "../../constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RatingInput } from "react-native-stock-star-rating";
import fetchOrderDetail from "../../hook/fetchOrderDetail";

const OrderDetails = ({ navigation, onPress }) => {
  const route = useRoute();
  const data = route.params.item;
  console.log("[OrderDetails]: My data = ", data);
  const { loading, distanceTime } = fetchOrderDetail(
    data.restaurantId.location.coordinates[0],
    data.restaurantId.location.coordinates[1]
  );

  const extractNumbers = (inputStr) => {
    if (typeof inputStr !== "string") {
      return [];
    }
    const matched = inputStr.match(/\d+/g);
    return matched ? matched.map((num) => parseInt(num, 10)) : [];
  };

  return (
    <View style={{ backgroundColor: COLORS.lightWhite }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backbtn}
      >
        <Ionicons name="chevron-back-circle" size={30} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("orders-page")}
        style={styles.shareBtn}
      >
        <MaterialCommunityIcons
          name="share-circle"
          size={30}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      <View>
        <NetworkImage
          source={data.orderItems[0].imageUrl}
          width={SIZES.width}
          height={SIZES.height / 3.4}
          radius={20}
        />

        <View style={styles.rating}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 12,
            }}
          >
            <RatingInput
              rating={Number(5)}
              setRating={5}
              size={20}
              maxStars={5}
              color={COLORS.lightWhite}
            />

            <TouchableOpacity
              style={styles.rateBtn}
              onPress={() => navigation.navigate("rating-page")}
            >
              <Text style={[styles.small, { marginLeft: 10, color: "white" }]}>
                Rate this shop
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8, marginHorizontal: 8, marginBottom: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.title, { fontFamily: "medium" }]}>Food</Text>

          <Text style={[styles.title, { marginLeft: 10 }]}>
            {data.orderItems[0].title}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>Distance</Text>
          <Text style={styles.small}>{distanceTime.distance}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>Cost</Text>

          {loading ? (
            ""
          ) : (
            <Text style={[styles.small, { marginLeft: 10 }]}>
              {distanceTime.finalPrice}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>
            Prep and Delivery Time
          </Text>

          <Text style={[styles.small, { marginLeft: 10 }]}>
            {extractNumbers(data.orderItems[0].time)[0] +
              extractNumbers(distanceTime.duration)[0]}{" "}
            mins
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>Quantity</Text>

          <Text style={[styles.small, { marginLeft: 10 }]}>
            {data.orderItems[0].quantity}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>
            Payment status
          </Text>

          <Text
            style={[
              `${data.paymentStatus}` === "Pending"
                ? styles.status
                : styles.small,
              { marginLeft: 10 },
            ]}
          >
            {data.paymentStatus}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { fontFamily: "medium" }]}>
            Order status
          </Text>

          <Text style={[styles.small, { marginLeft: 10 }]}>
            {data.orderStatus}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  backbtn: {
    marginLeft: 12,
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    top: SIZES.xxLarge,
  },
  shareBtn: {
    marginRight: 12,
    position: "absolute",
    right: 0,
    zIndex: 999,
    top: SIZES.xxLarge,
  },
  wrapper: {
    marginRight: 15,
    backgroundColor: COLORS.lightWhite,
    padding: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "medium",
    marginVertical: 5,
  },
  tile: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.gray,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  textContainer: {
    marginTop: 16,
    width: SIZES.width,
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  small: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  status: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.red,
  },
  rating: {
    height: 50,
    justifyContent: "center",
    width: "100%",
    // alignItems: "center",
    position: "absolute",
    backgroundColor: "#00fff53c",
    zIndex: 999,
    bottom: 0,
    borderRadius: 18,
  },
  rateBtn: {
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
  },
});
