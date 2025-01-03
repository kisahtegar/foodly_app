import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/theme";
import NetworkImage from "../components/NetworkImage";
import { RatingInput, Rating } from "react-native-stock-star-rating";

const CartItem = ({ item, deleteItem }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.innerRow}>
        <View
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            backgroundColor: COLORS.secondary,
            borderRadius: 8,
          }}
        >
          <Text
            style={[
              styles.restaurant,
              { color: COLORS.lightWhite, marginHorizontal: 5 },
            ]}
          >{` \$ ${item.totalPrice}`}</Text>
        </View>

        <TouchableOpacity
          onPress={deleteItem}
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            borderRadius: 8,
          }}
        >
          <AntDesign name="delete" size={20} color={COLORS.red} />
        </TouchableOpacity>

        <NetworkImage
          source={item.productId.imageUrl[0]}
          width={100}
          height={100}
          radius={16}
        />

        <View style={styles.row}>
          <View>
            <Text style={styles.restaurant}>{item.productId.title}</Text>
            {item.additives.length === 0 ? (
              <View style={{ height: 1 }} />
            ) : (
              <FlatList
                data={item.additives.slice(0, 3)}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                style={{ marginTop: 5 }}
                horizontal
                scrollEnabled
                renderItem={({ item }) => (
                  <View
                    style={{
                      right: 10,
                      marginHorizontal: 10,
                      backgroundColor: COLORS.gray2,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        paddingHorizontal: 4,
                        color: COLORS.lightWhite,
                        fontFamily: "regular",
                        fontSize: 11,
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                )}
              />
            )}

            <View style={{ height: 5 }} />
            <RatingInput
              rating={item.productId.rating}
              color={COLORS.secondary}
              setRating={item.rating}
              size={18}
              maxStars={5}
              bordered={false}
            />

            <View style={{ height: 5 }} />

            <Text style={styles.reviews}>
              {item.productId.ratingCount} Reviews
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width - 30,
    height: 120,
    marginBottom: 10,
    borderRadius: 12,
  },
  innerRow: {
    flexDirection: "row",
    margin: 10,
    backgroundColor: COLORS.offwhite,
    borderRadius: 16,
  },
  row: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  restaurant: { fontFamily: "medium", fontSize: 14 },
  reviews: {
    fontFamily: "medium",
    fontSize: 12,
    color: COLORS.gray,
  },
  reorder: {
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
  },
  price: {
    paddingLeft: 18,
    paddingTop: 5,
    fontFamily: "bold",
    fontSize: 17,
    color: COLORS.lightWhite,
  },
  reOrderTxt: {
    fontFamily: "medium",
    fontSize: 16,
    color: COLORS.lightWhite,
  },
});
